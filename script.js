/* ==========================================================
   CODENIX DIGITAL — script.js
   ========================================================== */

/* ----------------------------------------------------------
   CONFIGURAÇÕES — edite aqui
   ---------------------------------------------------------- */

// Número da agência para o WhatsApp, somente dígitos, com DDI e DDD.
// Exemplo de formato: "5500000000000". Deixe vazio até ter o número real.
const WHATSAPP_NUMERO = "5585984274433";

// Projetos do portfólio. Para usar seus projetos do GitHub, troque os itens abaixo:
//  - demo: true  → selo "Projeto demonstrativo"; false → selo "Projeto publicado"
//  - url: link do projeto publicado (GitHub Pages ou repositório). Vazio = botão desativado.
//  - imagem: caminho de um print, ex.: "assets/images/meu-projeto.jpg". Vazio = mockup ilustrativo.
const PROJETOS = [
  {
    nome: "MR Multimarcas",
    descricao: "Loja de roupas online com catálogo filtrável por categoria, carrinho e finalização do pedido pelo WhatsApp.",
    tecnologias: ["HTML5", "CSS3", "JavaScript"], // ajuste conforme o que você usou de fato
    url: "https://mr-imports-site.onrender.com/", imagem: "assets/images/mr-multimarcas.png", demo: false, cores: ["#1e3a8a", "#2563EB"],
    destaque: true, // card grande, ocupa a linha inteira
    itens: [      // pontos de destaque (só aparecem em projetos com destaque: true)
      "Catálogo com filtros por categoria",
      "Carrinho de compras no próprio site",
      "Pedido finalizado pelo WhatsApp",
      "Opção de entrega ou retirada na loja"
    ]
  },
  {
    nome: "Legacy Barber Club",
    descricao: "Conceito de barbearia premium com serviços, galeria e um simulador de agendamento que exibe uma confirmação de exemplo, sem enviar nada.",
    tecnologias: ["HTML5", "CSS3", "JavaScript"], // ajuste conforme o que foi usado de fato
    url: "https://codenixdigital.github.io/legacy-barber-club/", imagem: "assets/images/legacy-barber-club.png", demo: true, cores: ["#101010", "#b8995f"]
  },
  {
    nome: "BELLORA Ristorante Italiano",
    descricao: "Conceito de restaurante italiano com cardápio filtrável, pedido com carrinho, reservas e galeria. Tudo simulado, sem envio de pedidos.",
    tecnologias: ["HTML5", "CSS3", "JavaScript"],
    url: "https://codenixdigital.github.io/bellora-ristorante/", imagem: "assets/images/bellora-ristorante.png", demo: true, cores: ["#481F2B", "#25191B"]
  }
];

/* ---------------------------------------------------------- */

// Marca que o JS está ativo (as animações de reveal dependem disso)
document.documentElement.classList.add("js");

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ano automático no rodapé ---------- */
$("#ano").textContent = new Date().getFullYear();

/* ---------- Header: efeito ao rolar + botão voltar ao topo ---------- */
const header = $("#header");
const totop = $("#totop");
function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 20);
  totop.hidden = window.scrollY < 600;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* ---------- Menu mobile ---------- */
const burger = $("#burger");
const nav = $("#nav");
function setMenu(open) {
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- Link ativo conforme a seção visível ---------- */
const links = $$(".nav__list a[href^='#']:not(.btn)");
const secoes = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secoes.forEach(s => spy.observe(s));
}

/* ---------- Portfólio: gera os cards a partir de PROJETOS ---------- */
// Aceita só links https:// absolutos (bloqueia javascript:, data: etc.)
function urlSegura(u) {
  try { const x = new URL(u); return x.protocol === "https:" ? x.href : ""; } catch { return ""; }
}
// Aceita só imagens locais em assets/ ou https://
const imagemSegura = i => (/^assets\//.test(i) && !i.includes("..")) ? i : urlSegura(i);

function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

function renderPortfolio() {
  const grid = $("#portfolio-grid");
  PROJETOS.forEach(p => {
    const card = criarElemento("article", "card glass project reveal" + (p.destaque ? " project--featured" : ""));
    card.style.padding = "0";

    // Miniatura: imagem real ou mockup ilustrativo
    const thumb = criarElemento("div", "project__thumb");
    thumb.style.setProperty("--c1", p.cores?.[0] || "#1e3a8a");
    thumb.style.setProperty("--c2", p.cores?.[1] || "#2563EB");
    const imgSrc = imagemSegura(p.imagem || "");
    if (imgSrc) {
      const img = document.createElement("img");
      img.src = imgSrc; img.alt = "Prévia do projeto " + p.nome; img.loading = "lazy";
      thumb.appendChild(img);
    } else {
      const mock = criarElemento("div", "mock");
      mock.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 4; i++) mock.appendChild(document.createElement("i"));
      thumb.appendChild(mock);
    }
    thumb.appendChild(criarElemento("span", "project__badge", p.demo ? "Projeto demonstrativo" : "Projeto publicado"));

    // Corpo
    const body = criarElemento("div", "project__body");
    body.appendChild(criarElemento("h3", "", p.nome));
    body.appendChild(criarElemento("p", "", p.descricao));
    const tags = criarElemento("ul", "tags");
    p.tecnologias.forEach(t => tags.appendChild(criarElemento("li", "", t)));
    body.appendChild(tags);
    if (p.destaque && p.itens?.length) {
      const lista = criarElemento("ul", "project__list");
      p.itens.forEach(i => lista.appendChild(criarElemento("li", "", i)));
      body.insertBefore(lista, tags);
    }

    // Botão: só fica ativo quando houver URL real
    const btn = criarElemento("a", "btn btn--ghost btn--sm");
    const linkSeguro = urlSegura(p.url || "");
    if (linkSeguro) {
      btn.href = linkSeguro; btn.target = "_blank"; btn.rel = "noopener noreferrer";
      btn.textContent = "Acessar projeto";
    } else {
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = "Link em breve";
    }
    body.appendChild(btn);

    card.append(thumb, body);
    grid.appendChild(card);
  });
}
renderPortfolio();

/* ---------- Redes sociais: links vazios ficam marcados como "em breve" ---------- */
$$("[data-social]").forEach(a => {
  if (a.getAttribute("href") === "#") {
    a.classList.add("soon");
    a.setAttribute("aria-disabled", "true");
    a.addEventListener("click", e => e.preventDefault());
  } else {
    a.target = "_blank"; a.rel = "noopener noreferrer";
  }
});

/* ---------- Animações de entrada ao rolar ---------- */
const reveals = $$(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
    });
  }, { threshold: .12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

/* ---------- Formulário: validação + mensagem para WhatsApp ---------- */
const form = $("#form");
const status = $("#form-status");

const regras = {
  nome: v => v.trim().length >= 3 ? "" : "Informe seu nome completo.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido.",
  whatsapp: v => {
    const d = v.replace(/\D/g, "");
    return d.length >= 10 && d.length <= 11 ? "" : "Informe DDD + número, com 10 ou 11 dígitos.";
  },
  servico: v => v ? "" : "Selecione o tipo de serviço.",
  descricao: v => v.trim().length >= 10 ? "" : "Descreva o projeto em pelo menos 10 caracteres."
};

function validarCampo(nome) {
  const input = form.elements[nome];
  const msg = regras[nome](input.value);
  input.closest(".field").classList.toggle("invalid", !!msg);
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  $("#" + nome + "-err").textContent = msg;
  return !msg;
}

// Máscara simples de telefone: (00) 00000-0000
form.elements.whatsapp.addEventListener("input", e => {
  let d = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  else if (d.length) d = `(${d}`;
  e.target.value = d;
});

Object.keys(regras).forEach(nome => {
  form.elements[nome].addEventListener("blur", () => validarCampo(nome));
  form.elements[nome].addEventListener("input", () => {
    if (form.elements[nome].closest(".field").classList.contains("invalid")) validarCampo(nome);
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  status.className = "form__status field--full";
  status.textContent = "";

  const validos = Object.keys(regras).map(validarCampo);
  if (validos.includes(false)) {
    status.classList.add("error");
    status.textContent = "Corrija os campos destacados e tente novamente.";
    const primeiro = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form);
    if (primeiro) primeiro.focus();
    return;
  }

  // Sem número configurado, não há como abrir a conversa: avisamos com clareza.
  const numero = WHATSAPP_NUMERO.replace(/\D/g, "");
  if (!numero) {
    status.classList.add("error");
    status.textContent = "O WhatsApp da agência ainda não foi configurado. Nenhuma mensagem foi enviada.";
    return;
  }

  const f = form.elements;
  const texto =
    "Olá! Gostaria de solicitar um orçamento.\n\n" +
    `*Nome:* ${f.nome.value.trim()}\n` +
    `*E-mail:* ${f.email.value.trim()}\n` +
    `*WhatsApp:* ${f.whatsapp.value.trim()}\n` +
    `*Serviço:* ${f.servico.value}\n` +
    `*Projeto:* ${f.descricao.value.trim()}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener");
  status.classList.add("ok");
  status.textContent = "Abrimos o WhatsApp com a mensagem pronta. Confira e envie por lá.";
});
