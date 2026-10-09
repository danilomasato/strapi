import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFetchClient } from '@strapi/strapi/admin';

import {
  Box,
  Button,
  Flex,
  Loader,
  TextInput,
  Typography,
} from '@strapi/design-system';

type MediaFile = {
  id?: number;
  name?: string;
  url?: string;
  mime?: string;
  alternativeText?: string;
};

type Broker = {
  id?: number;
  documentId: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  creci?: string | number;
  credencialCreci?: MediaFile | number | null;
  attributes?: Record<string, unknown>;
};

type Announcement = {
  id?: number;
  documentId?: string;
  codigo?: string;
  imovel?: string;
  tipo?: string;
  status?: string;
  publishedAt?: string | null;
  locale?: string | null;
};

type ApiError = {
  message?: string;
  status?: number;
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
      };
      message?: string;
    };
  };
};

const BROKER_ENDPOINT =
  '/content-manager/collection-types/api::broker.broker';

const ANNOUNCEMENTS_ENDPOINT = '/broker-admin/anuncios';

const getBrokerValue = (broker: Broker, key: string) => {
  const attributes = broker.attributes || {};

  return broker[key as keyof Broker] ?? attributes[key];
};

const getFullName = (broker: Broker) => {
  const nome = getBrokerValue(broker, 'nome');
  const sobrenome = getBrokerValue(broker, 'sobrenome');

  return [nome, sobrenome]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Nome não informado';
};

const normalizeSearchText = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

const getFileUrl = (
  file: MediaFile | number | null | undefined
) => {
  if (!file || typeof file === 'number' || !file.url) {
    return null;
  }

  if (/^https?:\/\//i.test(file.url)) {
    return file.url;
  }

  return `${window.location.origin}${file.url.startsWith('/') ? '' : '/'}${file.url}`;
};

const getApiErrorMessage = (error: unknown): string => {
  const err = error as ApiError;
  const status = err?.response?.status ?? err?.status;
  const message =
    err?.response?.data?.error?.message
    ?? err?.response?.data?.message
    ?? err?.message;

  if (status === 401) {
    return 'Sua sessão pode ter expirado. Atualize o painel do Strapi e tente novamente.';
  }

  if (status === 403) {
    return 'Seu usuário não tem permissão para consultar os corretores.';
  }

  if (status === 404) {
    return 'A rota de consulta dos corretores não foi encontrada. Verifique a configuração do Content Manager.';
  }

  if (status === 429) {
    return 'Muitas solicitações em pouco tempo. Aguarde alguns instantes e tente novamente.';
  }

  if (status !== undefined && status >= 500) {
    return 'O servidor do Strapi apresentou uma falha temporária. Tente novamente.';
  }

  if (
    message
    && /network error|failed to fetch|networkerror/i.test(message)
  ) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }

  if (message) {
    return `Falha ao consultar os corretores: ${message}`;
  }

  return 'Não foi possível consultar os corretores. Tente novamente.';
};

const extractList = (payload: unknown): Broker[] => {
  if (Array.isArray(payload)) {
    return payload as Broker[];
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('A API retornou uma resposta vazia ou inválida.');
  }

  const data = payload as Record<string, unknown>;

  const candidates = [
    data.results,
    data.data,
    data.entries,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as Broker[];
    }

    if (candidate && typeof candidate === 'object') {
      const nested = candidate as Record<string, unknown>;

      if (Array.isArray(nested.results)) {
        return nested.results as Broker[];
      }

      if (Array.isArray(nested.data)) {
        return nested.data as Broker[];
      }

      if (Array.isArray(nested.entries)) {
        return nested.entries as Broker[];
      }
    }
  }

  throw new Error('A resposta da API não contém uma lista de corretores.');
};

const BrokerDetails = () => {
  const { get } = useFetchClient();

  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [credential, setCredential] = useState<MediaFile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [error, setError] = useState('');
  const [announcementsError, setAnnouncementsError] = useState('');
  const [announcementsMessage, setAnnouncementsMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const safeSearchName = normalizeSearchText(searchName);

  const filteredBrokers = useMemo(() => {
    if (!safeSearchName) {
      return brokers;
    }

    return brokers.filter((broker) =>
      normalizeSearchText(getFullName(broker)).includes(safeSearchName)
    );
  }, [brokers, safeSearchName]);

  const loadBrokers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await get(BROKER_ENDPOINT, {
        params: {
          page: 1,
          pageSize: 100,
          sort: 'nome:ASC',
          populate: 'credencialCreci',
        },
      });

      const results = extractList(response.data);

      setBrokers(results);
    } catch (err) {
      console.error('Erro ao carregar corretores:', err);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [get]);

  const loadAnnouncements = useCallback(async (brokerDocumentId: string) => {
    setLoadingAnnouncements(true);
    setAnnouncements([]);
    setAnnouncementsError('');
    setAnnouncementsMessage('');

    try {
      const response = await get(
        `${ANNOUNCEMENTS_ENDPOINT}/${encodeURIComponent(brokerDocumentId)}`
      );

      const payload = response.data;
      const results = Array.isArray(payload)
        ? payload
        : payload?.data;

      if (!Array.isArray(results)) {
        throw new Error('A API retornou uma lista de anúncios inválida.');
      }

      setAnnouncements(results);

      setAnnouncementsMessage(
        typeof payload?.message === 'string' ? payload.message : ''
      );
    } catch (err) {
      console.error('Erro ao carregar anúncios do corretor:', err);
      setAnnouncementsError(getApiErrorMessage(err));
    } finally {
      setLoadingAnnouncements(false);
    }
  }, [get]);

  const openBroker = useCallback(async (broker: Broker) => {
    setSelectedBroker(broker);
    setCredential(null);
    setAnnouncements([]);
    setAnnouncementsError('');
    setAnnouncementsMessage('');
    setPreviewOpen(false);
    setLoadingDetails(true);
    setError('');

    try {
      const response = await get(
        `${BROKER_ENDPOINT}/${encodeURIComponent(broker.documentId)}`,
        {
          params: {
            populate: 'credencialCreci',
          },
        }
      );

      const payload = response.data;
      const details = payload?.data ?? payload?.entry ?? payload;
      const attributes = details?.attributes || {};

      const normalizedBroker: Broker = {
        ...details,
        ...attributes,
        documentId: details?.documentId || broker.documentId,
      };

      setSelectedBroker(normalizedBroker);

      const file = normalizedBroker.credencialCreci;

      if (file && typeof file === 'object' && file.url) {
        setCredential(file);
      }
    } catch (err) {
      console.error('Erro ao carregar os dados do corretor:', err);
      setError(getApiErrorMessage(err));
    } finally {
      setLoadingDetails(false);
    }

    await loadAnnouncements(broker.documentId);
  }, [get, loadAnnouncements]);

  useEffect(() => {
    void loadBrokers();
  }, [loadBrokers]);

  const closeBroker = () => {
    setSelectedBroker(null);
    setCredential(null);
    setAnnouncements([]);
    setAnnouncementsError('');
    setAnnouncementsMessage('');
    setPreviewOpen(false);
    setError('');
  };

  const handleSearchChange = (
    value: string | React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue =
      typeof value === 'string'
        ? value
        : value?.target?.value ?? '';

    setSearchName(String(nextValue));
  };

  const name = selectedBroker ? getFullName(selectedBroker) : '';

  const email = selectedBroker
    ? getBrokerValue(selectedBroker, 'email')
    : '';

  const creci = selectedBroker
    ? getBrokerValue(selectedBroker, 'creci')
    : '';

  const credentialUrl = getFileUrl(credential);

  return (
    <Box padding={8}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom={6}
        gap={4}
      >
        <Box>
          <Typography variant={selectedBroker ? 'beta' : 'alpha'}>
            {selectedBroker ? 'CONSULTA DO CORRETOR' : 'CORRETORES'}
          </Typography>

          <Box paddingTop={2}>
            <Typography variant="omega" textColor="neutral600">
              {selectedBroker
                ? 'Consulta cadastral'
                : 'Selecione um corretor para consultar os dados cadastrais.'}
            </Typography>
          </Box>
        </Box>

        {selectedBroker && (
          <Button variant="secondary" onClick={closeBroker}>
            Voltar à lista
          </Button>
        )}
      </Flex>

      {error && (
        <Box
          padding={4}
          marginBottom={4}
          background="danger100"
          hasRadius
        >
          <Typography textColor="danger700">{error}</Typography>

          {!selectedBroker && !loading && (
            <Box paddingTop={3}>
              <Button
                variant="secondary"
                onClick={() => void loadBrokers()}
              >
                Tentar novamente
              </Button>
            </Box>
          )}
        </Box>
      )}

      {!selectedBroker && (
        <>
          {!loading && !error && brokers.length > 0 && (
            <Box paddingBottom={4}>
              <Box paddingBottom={2}>
                <Typography variant="pi" fontWeight="semiBold">
                  Buscar corretor por nome
                </Typography>
              </Box>

              <TextInput
                name="searchBroker"
                aria-label="Buscar corretor por nome"
                placeholder="Digite o nome ou sobrenome..."
                value={typeof searchName === 'string' ? searchName : ''}
                onChange={handleSearchChange}
              />

              {safeSearchName !== '' && (
                <Box paddingTop={2}>
                  <Typography variant="omega" textColor="neutral600">
                    {filteredBrokers.length === 1
                      ? '1 corretor encontrado'
                      : `${filteredBrokers.length} corretores encontrados`}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {loading ? (
            <Flex justifyContent="center" padding={8}>
              <Loader>Carregando corretores</Loader>
            </Flex>
          ) : error ? (
            <Box padding={4} background="neutral100" hasRadius>
              <Typography textColor="neutral600">
                A lista será exibida quando a consulta funcionar.
              </Typography>
            </Box>
          ) : brokers.length === 0 ? (
            <Box padding={5} background="neutral100" hasRadius>
              <Typography>Nenhum corretor encontrado.</Typography>
            </Box>
          ) : filteredBrokers.length === 0 ? (
            <Box padding={5} background="neutral100" hasRadius>
              <Typography>
                Nenhum corretor corresponde à busca por "{String(searchName)}".
              </Typography>

              <Box paddingTop={3}>
                <Button
                  variant="tertiary"
                  onClick={() => setSearchName('')}
                >
                  Limpar busca
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              background="neutral0"
              borderColor="neutral200"
              hasRadius
              borderWidth={1}
              padding={2}
            >
              {filteredBrokers.map((broker, index) => (
                <Box key={broker.documentId || broker.id || index}>
                  <Box padding={4}>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      gap={4}
                    >
                      <Box>
                        <Typography fontWeight="semiBold">
                          {getFullName(broker)}
                        </Typography>

                        <Box paddingTop={1}>
                          <Typography variant="omega" textColor="neutral600">
                            {String(
                              getBrokerValue(broker, 'email')
                              || 'E-mail não informado'
                            )}
                          </Typography>
                        </Box>

                        <Box paddingTop={1}>
                          <Typography variant="omega" textColor="neutral600">
                            CRECI: {String(
                              getBrokerValue(broker, 'creci')
                              || 'Não informado'
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        onClick={() => void openBroker(broker)}
                        variant="secondary"
                      >
                        Abrir ficha
                      </Button>
                    </Flex>
                  </Box>

                  {index < filteredBrokers.length - 1 && (
                    <Box
                      style={{
                        height: '1px',
                        background: '#DCDCE4',
                        width: '100%',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      {selectedBroker && (
        <>
          {loadingDetails ? (
            <Flex justifyContent="center" padding={8}>
              <Loader>Carregando dados do corretor</Loader>
            </Flex>
          ) : (
            <>
              <Box
                padding={6}
                background="neutral0"
                borderColor="neutral200"
                borderWidth={1}
                hasRadius
              >
                <Typography variant="beta">
                  DADOS DO CORRETOR
                </Typography>

                <Box paddingTop={5}>
                  <Flex
                    alignItems="flex-start"
                    gap="30px"
                    wrap="wrap"
                  >
                    <Box minWidth="220px">
                      <Typography variant="pi" textColor="neutral600">
                        Nome
                      </Typography>

                      <Box paddingTop={1}>
                        <Typography fontWeight="semiBold">
                          {name}
                        </Typography>
                      </Box>

                      <Box paddingTop="20px">
                        <Typography variant="pi" textColor="neutral600">
                          E-mail
                        </Typography>

                        <Box paddingTop={1}>
                          <Typography>
                            {String(email || 'Não informado')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="pi" textColor="neutral600">
                        CRECI
                      </Typography>

                      <Box paddingTop={1}>
                        <Typography>
                          {String(creci || 'Não informado')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="pi" textColor="neutral600">
                        Credencial CRECI
                      </Typography>

                      <Box paddingTop={2}>
                        {credentialUrl ? (
                          <Box>
                            {credential?.mime?.startsWith('image/') ? (
                              <img
                                src={credentialUrl}
                                alt={
                                  credential.alternativeText
                                  || 'Credencial CRECI'
                                }
                                style={{
                                  display: 'block',
                                  width: '150px',
                                  height: '100px',
                                  objectFit: 'contain',
                                  border: '1px solid #DCDCE4',
                                  borderRadius: '4px',
                                  background: '#FFFFFF',
                                }}
                              />
                            ) : (
                              <Box
                                padding={3}
                                background="neutral100"
                                hasRadius
                              >
                                <Typography variant="omega">
                                  {credential?.name || 'Documento CRECI'}
                                </Typography>
                              </Box>
                            )}

                            <Box paddingTop={2}>
                              <Button
                                variant="secondary"
                                onClick={() => setPreviewOpen(true)}
                              >
                                Ampliar foto
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Typography textColor="neutral600">
                            Credencial indisponível.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Box>

              <Box paddingTop={6} paddingBottom={4}>
                <Box
                  style={{
                    height: '1px',
                    background: '#DCDCE4',
                    width: '100%',
                  }}
                />
              </Box>

              <Box>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap={3}
                  wrap="wrap"
                >
                  <Typography variant="beta">ANÚNCIOS</Typography>

                  <Typography variant="omega" textColor="neutral600">
                    {loadingAnnouncements
                      ? 'Carregando quantidade de anúncios...'
                      : announcementsError
                        ? 'Quantidade de anúncios indisponível.'
                        : announcements.length === 1
                          ? '1 anúncio encontrado'
                          : `${announcements.length} anúncios encontrados`}
                  </Typography>
                </Flex>

                <Box paddingTop={3}>
                  {loadingAnnouncements ? (
                    <Flex justifyContent="center" padding={6}>
                      <Loader>Carregando anúncios</Loader>
                    </Flex>
                  ) : announcementsError ? (
                    <Box
                      padding={4}
                      background="danger100"
                      hasRadius
                    >
                      <Typography textColor="danger700">
                        {announcementsError}
                      </Typography>

                      <Box paddingTop={3}>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (selectedBroker) {
                              void loadAnnouncements(
                                selectedBroker.documentId
                              );
                            }
                          }}
                        >
                          Tentar novamente
                        </Button>
                      </Box>
                    </Box>
                  ) : announcements.length === 0 ? (
                    <Box
                      padding={4}
                      background="neutral100"
                      hasRadius
                    >
                      <Typography>
                        {announcementsMessage
                          || 'Nenhum anúncio encontrado para este corretor.'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      background="neutral0"
                      borderColor="neutral200"
                      borderWidth={1}
                      hasRadius
                      style={{ overflowX: 'auto' }}
                    >
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          textAlign: 'left',
                        }}
                      >
                        <thead>
                          <tr style={{ background: '#F6F6F9' }}>
                            {['Código', 'Imóvel', 'Tipo', 'Status'].map(
                              (heading) => (
                                <th
                                  key={heading}
                                  style={{
                                    padding: '14px 16px',
                                    borderBottom: '1px solid #DCDCE4',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {heading}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {announcements.map((announcement, index) => (
                            <tr
                              key={
                                announcement.documentId
                                || announcement.id
                                || `${announcement.codigo}-${index}`
                              }
                            >
                              <td
                                style={{
                                  padding: '14px 16px',
                                  borderBottom: '1px solid #EAEAEF',
                                  whiteSpace: 'nowrap',
                                  fontSize: '14px',
                                }}
                              >
                                {announcement.codigo || '—'}
                              </td>

                              <td
                                style={{
                                  padding: '14px 16px',
                                  borderBottom: '1px solid #EAEAEF',
                                  minWidth: '200px',
                                  fontSize: '14px',
                                }}
                              >
                                {announcement.imovel || 'Sem título'}
                              </td>

                              <td
                                style={{
                                  padding: '14px 16px',
                                  borderBottom: '1px solid #EAEAEF',
                                  fontSize: '14px',
                                }}
                              >
                                {announcement.tipo || '—'}
                              </td>

                              <td
                                style={{
                                  padding: '14px 16px',
                                  borderBottom: '1px solid #EAEAEF',
                                  whiteSpace: 'nowrap',
                                  fontSize: '14px',
                                }}
                              >
                                {announcement.status
                                  || (announcement.publishedAt
                                    ? 'Publicado'
                                    : 'Rascunho')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          )}
        </>
      )}

      {previewOpen && credentialUrl && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <Box
            style={{
              position: 'relative',
              maxWidth: '95vw',
              maxHeight: '90vh',
              background: '#FFFFFF',
              padding: '16px',
              borderRadius: '8px',
            }}
            onClick={(event: React.MouseEvent) => event.stopPropagation()}
          >
            <Flex justifyContent="flex-end" paddingBottom={3}>
              <Button
                variant="secondary"
                onClick={() => setPreviewOpen(false)}
              >
                Fechar
              </Button>
            </Flex>

            {credential?.mime?.startsWith('image/') ? (
              <img
                src={credentialUrl}
                alt={
                  credential.alternativeText
                  || 'Credencial CRECI ampliada'
                }
                style={{
                  display: 'block',
                  maxWidth: '88vw',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <iframe
                src={credentialUrl}
                title="Credencial CRECI"
                style={{
                  width: '80vw',
                  height: '75vh',
                  border: 0,
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BrokerDetails;