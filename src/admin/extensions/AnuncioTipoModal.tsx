import { useEffect, useState } from 'react';
import {
  unstable_useContentManagerContext as useContentManagerContext,
  useFetchClient,
} from '@strapi/strapi/admin';

type TipoAnuncio = 'venda' | 'aluguel' | 'lancamentos';

export const AnuncioTipoModal = () => {
  const { slug, id, form } = useContentManagerContext();
  const { get } = useFetchClient();

  const [ehVania, setEhVania] = useState(false);

  const [tipoSelecionado, setTipoSelecionado] =
    useState<TipoAnuncio | ''>('');

  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    let ativo = true;

    const verificarUsuario = async () => {
      try {
        const resposta = await get('/admin/users/me');

        const usuario = resposta.data?.data ?? resposta.data;

        if (ativo) {
          setEhVania(
            usuario?.username === 'vaniaAlbuquerque'
          );
        }
      } catch (error) {
        if (ativo) {
          setEhVania(false);
        }

        console.error(
          'Não foi possível identificar o usuário autenticado.',
          error
        );
      }
    };

    verificarUsuario();

    return () => {
      ativo = false;
    };
  }, [get]);

  if (
    slug !== 'api::anuncio.anuncio' ||
    id !== undefined ||
    confirmado
  ) {
    return null;
  }

  const confirmarSelecao = () => {
    if (!tipoSelecionado) return;

    // Impede a seleção de Lançamentos por outros usuários.
    if (tipoSelecionado === 'lancamentos' && !ehVania) {
      return;
    }

    form.onChange({
      target: {
        name: 'Tipo_de_Anuncio',
        value: tipoSelecionado,
      },
    });

    setConfirmado(true);
  };

  const opcoes = [
    {
      value: 'venda' as const,
      label: 'Venda',
      description: 'Imóvel disponível para compra.',
    },
    {
      value: 'aluguel' as const,
      label: 'Aluguel',
      description: 'Imóvel disponível para locação.',
    },
    ...(ehVania
      ? [
          {
            value: 'lancamentos' as const,
            label: 'Lançamentos',
            description:
              'Imóveis de empreendimentos em lançamento.',
          },
        ]
      : []),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="anuncio-tipo-titulo"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(16, 24, 40, 0.6)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 28,
          borderRadius: 12,
          background: '#ffffff',
          color: '#32324d',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h2
          id="anuncio-tipo-titulo"
          style={{ margin: '0 0 10px', fontSize: 21 }}
        >
          Selecione o tipo de Anúncio
        </h2>

        <p style={{ margin: '0 0 24px', color: '#666687' }}>
          Escolha o tipo de anúncio que deseja cadastrar.
        </p>

        {opcoes.map((opcao) => (
          <label
            key={opcao.value}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: 16,
              marginBottom: 12,
              border:
                tipoSelecionado === opcao.value
                  ? '2px solid #4945ff'
                  : '1px solid #dcdce4',
              borderRadius: 8,
              background:
                tipoSelecionado === opcao.value
                  ? '#f6f5ff'
                  : '#ffffff',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="tipo-anuncio-modal"
              value={opcao.value}
              checked={tipoSelecionado === opcao.value}
              onChange={() => setTipoSelecionado(opcao.value)}
              style={{ marginTop: 4 }}
            />

            <span>
              <strong>{opcao.label}</strong>

              <span
                style={{
                  display: 'block',
                  marginTop: 4,
                  fontSize: 13,
                  color: '#666687',
                }}
              >
                {opcao.description}
              </span>
            </span>
          </label>
        ))}

        <button
          type="button"
          disabled={!tipoSelecionado}
          onClick={confirmarSelecao}
          style={{
            width: '100%',
            padding: 13,
            border: 0,
            borderRadius: 6,
            background: tipoSelecionado
              ? '#4945ff'
              : '#dcdce4',
            color: '#ffffff',
            fontWeight: 600,
            cursor: tipoSelecionado
              ? 'pointer'
              : 'not-allowed',
          }}
        >
          Confirmar e continuar
        </button>
      </div>
    </div>
  );
};