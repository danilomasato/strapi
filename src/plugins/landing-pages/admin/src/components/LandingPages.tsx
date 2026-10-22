import React, { useEffect, useState } from 'react';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import './LandingPages.css';

const cleanProps = (props: any, omit: string[] = []) => {
  const result: any = {};
  Object.keys(props).forEach((key) => {
    if (['padding','paddingLeft','paddingRight','paddingBottom','paddingTop','marginBottom','background','borderColor','borderWidth','hasRadius','variant','textColor','fontWeight','startIcon','loading','size','gap','justifyContent','alignItems','wrap','flex','col','min','step'].includes(key) || omit.includes(key)) return;
    result[key] = props[key];
  });
  return result;
};
const Box = ({ children, ...p }: any) => <div className={`lp-box ${p.hasRadius ? 'lp-radius' : ''}`} {...cleanProps(p)}>{children}</div>;
const Flex = ({ children, ...p }: any) => <div className="lp-flex" style={{ justifyContent: p.justifyContent, alignItems: p.alignItems, gap: p.gap, flexWrap: p.wrap ? 'wrap' : undefined }} {...cleanProps(p)}>{children}</div>;
const Button = ({ children, variant, startIcon, loading, ...p }: any) => <button className={`lp-button lp-${variant || 'primary'}`} disabled={p.disabled || loading} {...cleanProps(p)}>{loading ? 'Salvando… ' : ''}{startIcon ? <span aria-hidden="true">＋ </span> : null}{children}</button>;
const Typography = ({ children, variant, textColor, ...p }: any) => { const Tag = variant === 'alpha' ? 'h1' : variant === 'delta' ? 'h3' : variant === 'pi' ? 'small' : 'p'; return <Tag className={`lp-text ${textColor ? 'lp-muted' : ''}`} {...cleanProps(p)}>{children}</Tag>; };
const TextInput = (p: any) => <input className="lp-input" {...p} />;
const Textarea = (p: any) => <textarea className="lp-input lp-textarea" {...p} />;
const NumberInput = TextInput;
const Divider = (p: any) => <hr className="lp-divider" />;
const Main = ({children}: any) => <main className="lp-main">{children}</main>;
const HeaderLayout = ({title, subtitle, primaryAction}: any) => <header className="lp-header"><div><h1>{title}</h1><p>{subtitle}</p></div>{primaryAction}</header>;
const Field = { Root: ({children}: any) => <label className="lp-field">{children}</label>, Label: ({children}: any) => <span className="lp-label">{children}</span>, Hint: ({children}: any) => <small className="lp-hint">{children}</small> };
const Grid = { Root: ({children}: any) => <div className="lp-grid">{children}</div>, Item: ({children, col}: any) => <div className={`lp-col lp-col-${col || 6}`}>{children}</div> };
const SingleSelect = ({children, value, onChange}: any) => <select className="lp-input" value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>;
const SingleSelectOption = ({children, value}: any) => <option value={value}>{children}</option>;
const Plus = () => null; const Trash = () => null; const Refresh = () => null; const Check = () => null;

type MediaValue = number | '';
type CardData = {
  id?: number;
  titulo: string;
  descricao: string;
  preco: string;
  imagem: MediaValue;
};
type LandingPageData = {
  documentId?: string;
  id?: number;
  nomeEmpreendimento: string;
  subdominio: string;
  tipoTemplate: 'template-1' | 'template-2';
  subTituloTopo: string;
  tituloTopo: string;
  descricaoTopo: string;
  telefoneContato: string;
  imagemTopo: MediaValue;
  tituloConteudo1: string;
  cardsConteudo1: CardData[];
  imagensGaleria: number[];
  tituloConteudo2: string;
  cardsConteudo2: CardData[];
  publishedAt?: string | null;
};

const emptyCard = (): CardData => ({ titulo: '', descricao: '', preco: '', imagem: '' });
const emptyPage = (): LandingPageData => ({
  nomeEmpreendimento: '',
  subdominio: '',
  tipoTemplate: 'template-1',
  subTituloTopo: '',
  tituloTopo: '',
  descricaoTopo: '',
  telefoneContato: '',
  imagemTopo: '',
  tituloConteudo1: '',
  cardsConteudo1: [],
  imagensGaleria: [],
  tituloConteudo2: '',
  cardsConteudo2: [],
});

const API = '/api/landing-pages';

const LandingPages = () => {
  const { get, post, put, del } = useFetchClient();
  const toggleNotification = useNotification();
  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [listSearch, setListSearch] = useState('');
  const [selected, setSelected] = useState<string>('');
  const [form, setForm] = useState<LandingPageData>(emptyPage());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [folderId, setFolderId] = useState<number | null>(null);

  const update = <K extends keyof LandingPageData>(key: K, value: LandingPageData[K]) =>
    setForm((old) => ({ ...old, [key]: value }));

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await get(`${API}?status=draft&pagination[pageSize]=100&populate=*`);
      const data = response.data?.data ?? [];
      setItems(data);
    } catch (e: any) {
      setError('Não foi possível carregar a coleção. Confira se a coleção Landing Page está instalada e se o usuário tem permissão de acesso à API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const normalizeCard = (card: any): CardData => ({
    id: card.id,
    titulo: card.titulo ?? '',
    descricao: card.descricao ?? '',
    preco: card.preco == null ? '' : String(card.preco),
    imagem: card.imagem?.id ?? card.imagem ?? '',
  });

  const editItem = (item: any) => {
    const a = item.attributes ?? item;
    const mediaId = (v: any) => v?.data?.id ?? v?.id ?? (typeof v === 'number' ? v : '');
    setSelected(item.documentId ?? String(item.id));
    setForm({
      documentId: item.documentId,
      id: item.id,
      nomeEmpreendimento: a.nomeEmpreendimento ?? '',
      subdominio: a.subdominio ?? '',
      tipoTemplate: a.tipoTemplate ?? 'template-1',
      subTituloTopo: a.subTituloTopo ?? '',
      tituloTopo: a.tituloTopo ?? '',
      descricaoTopo: a.descricaoTopo ?? '',
      telefoneContato: a.telefoneContato ?? '',
      imagemTopo: mediaId(a.imagemTopo),
      tituloConteudo1: a.tituloConteudo1 ?? '',
      cardsConteudo1: (a.cardsConteudo1?.data ?? a.cardsConteudo1 ?? []).map(normalizeCard),
      imagensGaleria: (a.imagensGaleria?.data ?? a.imagensGaleria ?? []).map((m: any) => typeof m === 'number' ? m : m.id).filter(Boolean),
      tituloConteudo2: a.tituloConteudo2 ?? '',
      cardsConteudo2: (a.cardsConteudo2?.data ?? a.cardsConteudo2 ?? []).map(normalizeCard),
      publishedAt: a.publishedAt ?? null,
    });
    setError('');
    setFolderId(null);
    setView('form');
  };

  const newItem = () => { setSelected(''); setForm(emptyPage()); setError(''); setFolderId(null); setView('form'); };

  const updateCard = (section: 'cardsConteudo1' | 'cardsConteudo2', index: number, key: keyof CardData, value: any) => {
    setForm((old) => {
      const cards = [...old[section]];
      cards[index] = { ...cards[index], [key]: value };
      return { ...old, [section]: cards };
    });
  };

  const moveCard = (section: 'cardsConteudo1' | 'cardsConteudo2', index: number, direction: -1 | 1) => {
    setForm((old) => {
      const cards = [...old[section]];
      const target = index + direction;
      if (target < 0 || target >= cards.length) return old;
      [cards[index], cards[target]] = [cards[target], cards[index]];
      return { ...old, [section]: cards };
    });
  };

  const save = async (publish: boolean) => {
    if (!form.nomeEmpreendimento.trim() || !form.subdominio.trim()) {
      setError('Preencha Nome do empreendimento e Subdomínio antes de salvar.');
      return;
    }
    setSaving(true);
    setError('');
    const cardPayload = (cards: CardData[]) => cards.map((c) => ({
      ...(c.id ? { id: c.id } : {}),
      titulo: c.titulo,
      descricao: c.descricao,
      preco: c.preco === '' ? null : Number(c.preco),
      imagem: c.imagem === '' ? null : Number(c.imagem),
    }));
    const data: any = {
      nomeEmpreendimento: form.nomeEmpreendimento,
      subdominio: form.subdominio,
      tipoTemplate: form.tipoTemplate,
      subTituloTopo: form.subTituloTopo,
      tituloTopo: form.tituloTopo,
      descricaoTopo: form.descricaoTopo,
      telefoneContato: form.telefoneContato,
      imagemTopo: form.imagemTopo === '' ? null : Number(form.imagemTopo),
      tituloConteudo1: form.tituloConteudo1,
      cardsConteudo1: cardPayload(form.cardsConteudo1),
      imagensGaleria: form.imagensGaleria.map(Number),
      tituloConteudo2: form.tituloConteudo2,
      cardsConteudo2: cardPayload(form.cardsConteudo2),
    };
    if (publish) data.publishedAt = new Date().toISOString();
    let createdSubdomain = false;
    const oldSubdomain = selected ? String((items.find((entry) => (entry.documentId ?? String(entry.id)) === selected)?.attributes ?? items.find((entry) => (entry.documentId ?? String(entry.id)) === selected) ?? {}).subdominio ?? '') : '';
    const newSubdomain = form.subdominio.trim().toLowerCase();
    try {
      // Cria primeiro o subdomínio quando for uma nova landing page ou quando o prefixo mudar.
      if (!oldSubdomain || oldSubdomain.toLowerCase() !== newSubdomain) {
        const hostingerResponse = await post('/landing-pages/hostinger/subdomains', { subdomain: newSubdomain });
        if (hostingerResponse.data?.error) throw new Error(hostingerResponse.data.error);
        createdSubdomain = true;
      }

      let response;
      if (selected) {
        response = await put(`${API}/${selected}`, { data });
      } else {
        response = await post(API, { data });
      }
      const item = response.data?.data;

      // Só remove o prefixo anterior depois que o cadastro com o novo prefixo foi salvo.
      if (oldSubdomain && oldSubdomain.toLowerCase() !== newSubdomain) {
        try {
          await del(`/landing-pages/hostinger/subdomains/${encodeURIComponent(oldSubdomain)}`);
        } catch (cleanupError) {
          toggleNotification({ type: 'warning', message: `Landing page salva, mas não foi possível excluir o subdomínio antigo (${oldSubdomain}) na Hostinger.` });
        }
      }

      if (item) {
        setSelected(item.documentId ?? String(item.id));
        setForm((old) => ({ ...old, documentId: item.documentId, id: item.id, publishedAt: item.publishedAt ?? (publish ? new Date().toISOString() : null) }));
      }
      toggleNotification({ type: 'success', message: publish ? 'Landing page publicada e subdomínio configurado.' : 'Rascunho salvo e subdomínio configurado.' });
      await loadItems();
      setView('list');
    } catch (e: any) {
      // Evita deixar um subdomínio recém-criado sem cadastro caso o salvamento falhe.
      if (createdSubdomain) {
        try { await del(`/landing-pages/hostinger/subdomains/${encodeURIComponent(newSubdomain)}`); } catch { /* Mantém o erro original; a limpeza pode ser feita manualmente. */ }
      }
      const message = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Erro desconhecido.';
      setError(`Não foi possível salvar a landing page: ${message}`);
      toggleNotification({ type: 'warning', message: 'Falha ao salvar landing page ou configurar o subdomínio.' });
    } finally {
      setSaving(false);
    }
  };

  const ensureLandingFolder = async () => {
    if (folderId) return folderId;
    const rawFolderName = form.nomeEmpreendimento.trim();
    if (!rawFolderName) {
      throw new Error('Preencha primeiro o Nome do empreendimento para que as imagens sejam salvas na pasta correta.');
    }
    const folderName = rawFolderName.replace(/[\\/:*?"<>|]/g, '-').slice(0, 100);
    const response = await get(`/upload/folders?filters[name][$eq]=${encodeURIComponent(folderName)}&pagination[pageSize]=100`);
    const existing = response.data?.data?.find((folder: any) => folder.name === folderName);
    if (existing?.id) { setFolderId(existing.id); return existing.id; }
    const created = await post('/upload/folders', { name: folderName });
    const id = created.data?.data?.id ?? created.data?.id;
    if (!id) throw new Error('Não foi possível criar a pasta de mídia da landing page.');
    setFolderId(id);
    return id;
  };

  const uploadImage = async (file: File, onChange: (value: MediaValue) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Selecione um arquivo de imagem.'); return; }
    setUploading(true); setError('');
    try {
      const folder = await ensureLandingFolder();
      const body = new FormData();
      body.append('files', file);
      body.append('fileInfo', JSON.stringify({ name: file.name, folder }));
      const response = await post('/upload', body);
      const uploaded = Array.isArray(response.data) ? response.data[0] : response.data?.data?.[0];
      if (!uploaded?.id) throw new Error('O Strapi não retornou o arquivo enviado.');
      onChange(uploaded.id);
      toggleNotification({ type: 'success', message: `Imagem enviada para a pasta ${form.nomeEmpreendimento}.` });
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || 'Não foi possível enviar a imagem. Verifique as permissões de mídia do painel.');
    } finally { setUploading(false); }
  };

  const mediaField = (label: string, value: MediaValue, onChange: (value: MediaValue) => void, hint: string) => (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <input className="lp-input" type="file" accept="image/*" disabled={uploading} onChange={(e: any) => { const file = e.target.files?.[0]; if (file) uploadImage(file, onChange); e.target.value = ''; }} />
      {value !== '' && <Field.Hint>Imagem enviada (ID interno {value}). Selecione outro arquivo para substituir.</Field.Hint>}
      <Field.Hint>{hint}</Field.Hint>
    </Field.Root>
  );

  const renderCards = (section: 'cardsConteudo1' | 'cardsConteudo2', title: string) => (
    <Box background="neutral0" borderColor="neutral200" borderWidth="1px" hasRadius padding={5} marginBottom={4}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Typography variant="delta">{title}</Typography>
        <Button startIcon={<Plus />} onClick={() => update(section, [...form[section], emptyCard()])} variant="secondary">Adicionar card</Button>
      </Flex>
      {form[section].length === 0 && <Typography textColor="neutral600">Nenhum card adicionado.</Typography>}
      {form[section].map((card, index) => (
        <Box key={`${section}-${index}`} padding={4} background="neutral100" hasRadius marginBottom={3}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom={3}>
            <Typography fontWeight="bold">Card {index + 1}</Typography>
            <Flex gap={2}>
              <Button size="S" variant="tertiary" disabled={index === 0} onClick={() => moveCard(section, index, -1)}>↑</Button>
              <Button size="S" variant="tertiary" disabled={index === form[section].length - 1} onClick={() => moveCard(section, index, 1)}>↓</Button>
              <Button size="S" variant="danger-light" startIcon={<Trash />} onClick={() => update(section, form[section].filter((_, i) => i !== index))}>Remover</Button>
            </Flex>
          </Flex>
          <Grid.Root gap={4}>
            <Grid.Item col={6}><Field.Root><Field.Label>Título</Field.Label><TextInput value={card.titulo} onChange={(e: any) => updateCard(section, index, 'titulo', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={6}>{mediaField('Imagem do card', card.imagem, (v) => updateCard(section, index, 'imagem', v), 'Envie a imagem deste card.')}</Grid.Item>
            <Grid.Item col={8}><Field.Root><Field.Label>Descrição</Field.Label><Textarea value={card.descricao} onChange={(e: any) => updateCard(section, index, 'descricao', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={4}><Field.Root><Field.Label>Preço</Field.Label><TextInput type="number" min={0} step="0.01" value={card.preco} onChange={(e: any) => updateCard(section, index, 'preco', e.target.value)} placeholder="0,00" /></Field.Root></Grid.Item>
          </Grid.Root>
        </Box>
      ))}
    </Box>
  );

  const deleteItem = async (item: any) => {
    const a = item.attributes ?? item;
    const id = item.documentId ?? String(item.id);
    const subdomain = String(a.subdominio ?? '').trim();
    const name = a.nomeEmpreendimento || subdomain || 'esta landing page';
    if (!window.confirm(`Deseja excluir "${name}"? Essa ação também tentará excluir o subdomínio ${subdomain ? `${subdomain}.tudosobreap.com.br` : 'associado'} na Hostinger.`)) return;
    setLoading(true);
    setError('');
    try {
      if (subdomain) await del(`/landing-pages/hostinger/subdomains/${encodeURIComponent(subdomain)}`);
      await del(`${API}/${id}`);
      toggleNotification({ type: 'success', message: 'Landing page e subdomínio excluídos.' });
      await loadItems();
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Erro desconhecido.';
      setError(`Não foi possível excluir a landing page: ${message}`);
      toggleNotification({ type: 'warning', message: 'Falha ao excluir landing page/subdomínio.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const a = item.attributes ?? item;
    const q = listSearch.trim().toLowerCase();
    return !q || [a.nomeEmpreendimento, a.subdominio, a.tipoTemplate].some((v) => String(v ?? '').toLowerCase().includes(q));
  });

  if (view === 'list') {
    return (
      <Main>
        <HeaderLayout title="Landing Pages" subtitle="Consulte, edite e cadastre suas páginas de campanha." primaryAction={<Button onClick={newItem}>＋ Nova landing page</Button>} />
        <Box>
          {error && <Box><Typography>{error}</Typography></Box>}
          <div className="lp-list-toolbar">
            <div><h2>Landing pages cadastradas</h2><p>Gerencie as páginas e seus conteúdos em um só lugar.</p></div>
            <div className="lp-list-actions"><input className="lp-input lp-search" value={listSearch} onChange={(e: any) => setListSearch(e.target.value)} placeholder="Buscar por nome ou subdomínio…" /><Button variant="secondary" onClick={loadItems} disabled={loading}>{loading ? 'Atualizando…' : 'Atualizar'}</Button></div>
          </div>
          {loading ? <div className="lp-empty">Carregando landing pages…</div> : filteredItems.length === 0 ? (
            <div className="lp-empty"><div className="lp-empty-icon">▤</div><h3>{listSearch ? 'Nenhum resultado encontrado' : 'Nenhuma landing page cadastrada'}</h3><p>{listSearch ? 'Tente buscar por outro nome ou subdomínio.' : 'Crie sua primeira landing page para começar.'}</p>{!listSearch && <Button onClick={newItem}>＋ Criar landing page</Button>}</div>
          ) : (
            <div className="lp-table-wrap"><table className="lp-table"><thead><tr><th>Landing page</th><th>Subdomínio</th><th>Template</th><th>Status</th><th></th></tr></thead><tbody>
              {filteredItems.map((item) => { const a = item.attributes ?? item; const id = item.documentId ?? String(item.id); const published = Boolean(a.publishedAt); return <tr key={id}><td><strong>{a.nomeEmpreendimento || 'Sem nome'}</strong></td><td>{a.subdominio || '—'}</td><td>{a.tipoTemplate === 'template-2' ? 'Template 2' : 'Template 1'}</td><td><span className={`lp-status ${published ? 'lp-status-published' : 'lp-status-draft'}`}>{published ? 'Publicada' : 'Rascunho'}</span></td><td className="lp-table-action"><Button variant="secondary" onClick={() => editItem(item)}>Editar</Button> <Button variant="danger-light" onClick={() => deleteItem(item)}>Excluir</Button></td></tr>; })}
            </tbody></table></div>
          )}
          <div className="lp-list-footer">{filteredItems.length} {filteredItems.length === 1 ? 'landing page' : 'landing pages'}{listSearch ? ' encontradas' : ' cadastradas'}</div>
        </Box>
      </Main>
    );
  }

  return (
    <Main>
      <HeaderLayout title={selected ? 'Editar landing page' : 'Nova landing page'} subtitle="Preencha os dados e gerencie os conteúdos da página." primaryAction={<Button variant="secondary" onClick={() => { setView('list'); setError(''); }}>← Voltar para a lista</Button>} />
      <div className="lp-form-page">
      <Box paddingLeft={8} paddingRight={8} paddingBottom={8}>
        {uploading && <Box><Typography>Enviando imagem para a pasta da landing page…</Typography></Box>}
        {error && <Box background="danger100" padding={3} hasRadius marginBottom={4}><Typography textColor="danger700">{error}</Typography></Box>}
        <Box background="neutral0" borderColor="neutral200" borderWidth="1px" hasRadius padding={6}>
          <Typography variant="alpha" marginBottom={2}>{selected ? 'Editar landing page' : 'Nova landing page'}</Typography>
          <Typography textColor="neutral600" marginBottom={6}>Cadastre os dados da página e envie as imagens diretamente. Os arquivos serão organizados em uma pasta da Biblioteca de mídia com o nome do empreendimento.</Typography>

          <Typography variant="delta" marginBottom={4}>1. Dados gerais</Typography>
          <Grid.Root gap={4} marginBottom={6}>
              <Grid.Item col={6}><Field.Root><Field.Label>Nome do empreendimento *</Field.Label><TextInput value={form.nomeEmpreendimento} onChange={(e: any) => update('nomeEmpreendimento', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={6}><Field.Root><Field.Label>Subdomínio *</Field.Label><TextInput value={form.subdominio} onChange={(e: any) => update('subdominio', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="ex.: empreendimento" /></Field.Root></Grid.Item>
            <Grid.Item col={6}><Field.Root><Field.Label>Tipo de template *</Field.Label><SingleSelect value={form.tipoTemplate} onChange={(v: any) => update('tipoTemplate', v)}><SingleSelectOption value="template-1">Template 1</SingleSelectOption><SingleSelectOption value="template-2">Template 2</SingleSelectOption></SingleSelect></Field.Root></Grid.Item>
          </Grid.Root>

          <Divider marginBottom={5} />
          <Typography variant="delta" marginBottom={4}>2. Título</Typography>
          <Grid.Root gap={4} marginBottom={6}>
            <Grid.Item col={6}>{mediaField('Imagem de fundo', form.imagemTopo, (v) => update('imagemTopo', v), 'Envie a imagem de fundo do banner.')}</Grid.Item>
            <Grid.Item col={6}><Field.Root><Field.Label>Sub Título</Field.Label><TextInput value={form.subTituloTopo} onChange={(e: any) => update('subTituloTopo', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={6}><Field.Root><Field.Label>Título</Field.Label><TextInput value={form.tituloTopo} onChange={(e: any) => update('tituloTopo', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={6}><Field.Root><Field.Label>Telefone</Field.Label><TextInput value={form.telefoneContato} onChange={(e: any) => update('telefoneContato', e.target.value)} /></Field.Root></Grid.Item>
            <Grid.Item col={12}><Field.Root><Field.Label>Descrição</Field.Label><Textarea value={form.descricaoTopo} onChange={(e: any) => update('descricaoTopo', e.target.value)} /></Field.Root></Grid.Item>
          </Grid.Root>

          <Divider marginBottom={5} />
          <Typography variant="delta" marginBottom={4}>3. Conteúdo 1</Typography>
          <Box marginBottom={4}><Field.Root><Field.Label>Título da seção</Field.Label><TextInput value={form.tituloConteudo1} onChange={(e: any) => update('tituloConteudo1', e.target.value)} /></Field.Root></Box>
          {renderCards('cardsConteudo1', 'Cards do Conteúdo 1')}

          <Divider marginBottom={5} />
          <Typography variant="delta" marginBottom={4}>4. Galeria</Typography>
          <Box background="neutral0" borderColor="neutral200" borderWidth="1px" hasRadius padding={5} marginBottom={6}>
            <Flex justifyContent="space-between" alignItems="center" marginBottom={3}>
              <Typography>Imagens da galeria</Typography>
              <Button startIcon={<Plus />} variant="secondary" onClick={() => update('imagensGaleria', [...form.imagensGaleria, 0])}>Adicionar imagem</Button>
            </Flex>
            {form.imagensGaleria.length === 0 && <Typography textColor="neutral600">Nenhuma imagem adicionada.</Typography>}
            {form.imagensGaleria.map((id, index) => (
              <Flex key={`gallery-${index}`} gap={2} alignItems="end" marginBottom={3}>
                <Box flex="1"><Field.Root><Field.Label>Imagem {index + 1}</Field.Label><input className="lp-input" type="file" accept="image/*" disabled={uploading} onChange={(e: any) => { const file = e.target.files?.[0]; if (file) uploadImage(file, (v) => update('imagensGaleria', form.imagensGaleria.map((old, i) => i === index ? Number(v) : old))); e.target.value = ''; }} />{id ? <small className="lp-hint">Imagem enviada (ID interno {id}).</small> : null}</Field.Root></Box>
                <Button variant="tertiary" disabled={index === 0} onClick={() => { const next = [...form.imagensGaleria]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; update('imagensGaleria', next); }}>↑</Button>
                <Button variant="tertiary" disabled={index === form.imagensGaleria.length - 1} onClick={() => { const next = [...form.imagensGaleria]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; update('imagensGaleria', next); }}>↓</Button>
                <Button variant="danger-light" startIcon={<Trash />} onClick={() => update('imagensGaleria', form.imagensGaleria.filter((_, i) => i !== index))}>Remover</Button>
              </Flex>
            ))}
            <Typography textColor="neutral600" variant="pi">As imagens enviadas ficam na pasta desta landing page. A ordem listada será mantida.</Typography>
          </Box>

          <Divider marginBottom={5} />
          <Typography variant="delta" marginBottom={4}>5. Conteúdo 2</Typography>
          <Box marginBottom={4}><Field.Root><Field.Label>Título da seção</Field.Label><TextInput value={form.tituloConteudo2} onChange={(e: any) => update('tituloConteudo2', e.target.value)} /></Field.Root></Box>
          {renderCards('cardsConteudo2', 'Cards do Conteúdo 2')}

          <Divider marginBottom={5} />
          <Flex justifyContent="flex-end" gap={3}>
            <Button variant="secondary" onClick={newItem}>Limpar formulário</Button>
            <Button variant="secondary" startIcon={<Check />} loading={saving} onClick={() => save(false)}>Salvar rascunho</Button>
            <Button loading={saving} onClick={() => save(true)}>Publicar</Button>
          </Flex>
        </Box>
      </Box>
      </div>
    </Main>
  );
};

export default LandingPages;
