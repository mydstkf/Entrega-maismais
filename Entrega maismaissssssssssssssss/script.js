// Entrega++ - dados ficam salvos neste navegador usando localStorage.
let clientes = lerDados("clientes");
let fornecedores = lerDados("fornecedores");
let pedidos = lerDados("pedidos");
let categoriaAtual = "";

function lerDados(chave) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave));
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function todasPaginas() {
  ["paginaInicial", "paginaCliente", "paginaFornecedor", "paginaCadastros", "paginaPedidos", "paginaEntregador"].forEach(id => {
    document.getElementById(id).classList.add("escondido");
  });
  document.querySelector(".topbar").classList.remove("menu-open");
}

function mostrarInicio() {
  todasPaginas();
  document.getElementById("paginaInicial").classList.remove("escondido");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarCliente() {
  todasPaginas();
  document.getElementById("paginaCliente").classList.remove("escondido");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarFornecedor() {
  todasPaginas();
  document.getElementById("paginaFornecedor").classList.remove("escondido");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarCadastros() {
  todasPaginas();
  document.getElementById("paginaCadastros").classList.remove("escondido");
  renderizarCadastros();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarPedidosPagina() {
  categoriaAtual = "";
  todasPaginas();
  document.getElementById("paginaPedidos").classList.remove("escondido");
  preencherClientes();
  document.getElementById("categoriaPedido").value = "Restaurante";
  document.getElementById("pesquisa").value = "";
  mostrarPedidos();
  atualizarResumo();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function abrirPedidosCategoria(categoria) {
  mostrarPedidosPagina();
  categoriaAtual = categoria;
  document.getElementById("categoriaPedido").value = categoria;
  mostrarPedidos();
  document.getElementById("pedido").focus();
}

function abrirRestaurante(nome) {
  abrirPedidosCategoria("Restaurante");
  const campoPedido = document.getElementById("pedido");
  if (campoPedido) {
    campoPedido.value = nome + " - ";
    campoPedido.focus();
  }
  mostrarToast("Restaurante selecionado: " + nome);
}

function mostrarEntregador() {
  todasPaginas();
  document.getElementById("paginaEntregador").classList.remove("escondido");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function alternarMenu() {
  document.querySelector(".topbar").classList.toggle("menu-open");
}

function usarEndereco() {
  const endereco = document.getElementById("enderecoBusca").value.trim();
  const mensagem = document.getElementById("mensagemEndereco");
  if (!endereco) {
    mensagem.textContent = "Digite um endereço para usar no cadastro de um pedido.";
    return;
  }
  localStorage.setItem("enderecoEntregaPadrao", endereco);
  mensagem.textContent = "Endereço guardado! Ele poderá ser usado no próximo pedido.";
  mostrarToast("Endereço guardado para o próximo pedido.");
}

function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  toast.textContent = texto;
  toast.classList.add("show");
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function salvarCliente(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeCliente").value.trim();
  const telefone = document.getElementById("telefoneCliente").value.trim();
  const endereco = document.getElementById("enderecoCliente").value.trim();
  if (!nome || !telefone || !endereco) {
    mostrarToast("Preencha todos os campos do cliente.");
    return;
  }
  clientes.push({ id: Date.now(), nome, telefone, endereco });
  salvarDados("clientes", clientes);
  event.target.reset();
  mostrarToast("Cliente cadastrado com sucesso!");
  mostrarInicio();
}

function salvarFornecedor(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeFornecedor").value.trim();
  const telefone = document.getElementById("telefoneFornecedor").value.trim();
  const endereco = document.getElementById("enderecoFornecedor").value.trim();
  if (!nome || !telefone || !endereco) {
    mostrarToast("Preencha todos os campos do fornecedor.");
    return;
  }
  fornecedores.push({ id: Date.now(), nome, telefone, endereco });
  salvarDados("fornecedores", fornecedores);
  event.target.reset();
  mostrarToast("Fornecedor cadastrado com sucesso!");
  mostrarInicio();
}

function renderizarCadastros() {
  const listaClientes = document.getElementById("listaClientes");
  const listaFornecedores = document.getElementById("listaFornecedores");
  document.getElementById("contadorClientes").textContent = clientes.length;
  document.getElementById("contadorFornecedores").textContent = fornecedores.length;

  listaClientes.innerHTML = "";
  if (clientes.length === 0) {
    listaClientes.innerHTML = '<div class="empty-state">Nenhum cliente cadastrado ainda.</div>';
  } else {
    clientes.forEach(cliente => {
      const card = document.createElement("article");
      card.className = "record-card";
      card.innerHTML = `<strong>${escapar(cliente.nome)}</strong>
        <p>📞 ${escapar(cliente.telefone)}</p><p>📍 ${escapar(cliente.endereco)}</p>
        <button class="delete-button" type="button" onclick="excluirCliente(${cliente.id})">Excluir cliente</button>`;
      listaClientes.appendChild(card);
    });
  }

  listaFornecedores.innerHTML = "";
  if (fornecedores.length === 0) {
    listaFornecedores.innerHTML = '<div class="empty-state">Nenhum fornecedor cadastrado ainda.</div>';
  } else {
    fornecedores.forEach(fornecedor => {
      const card = document.createElement("article");
      card.className = "record-card";
      card.innerHTML = `<strong>${escapar(fornecedor.nome)}</strong>
        <p>📞 ${escapar(fornecedor.telefone)}</p><p>📍 ${escapar(fornecedor.endereco)}</p>
        <button class="delete-button" type="button" onclick="excluirFornecedor(${fornecedor.id})">Excluir fornecedor</button>`;
      listaFornecedores.appendChild(card);
    });
  }
}

function excluirCliente(id) {
  const temPedido = pedidos.some(p => Number(p.clienteId) === Number(id));
  if (temPedido) {
    alert("Este cliente tem pedidos cadastrados. Exclua os pedidos dele antes de excluir o cliente.");
    return;
  }
  if (!confirm("Deseja realmente excluir este cliente?")) return;
  clientes = clientes.filter(c => Number(c.id) !== Number(id));
  salvarDados("clientes", clientes);
  renderizarCadastros();
  mostrarToast("Cliente excluído.");
}

function excluirFornecedor(id) {
  if (!confirm("Deseja realmente excluir este fornecedor?")) return;
  fornecedores = fornecedores.filter(f => Number(f.id) !== Number(id));
  salvarDados("fornecedores", fornecedores);
  renderizarCadastros();
  mostrarToast("Fornecedor excluído.");
}

function preencherClientes() {
  const select = document.getElementById("cliente");
  const aviso = document.getElementById("avisoSemCliente");
  const selecionadoAntes = select.value;
  select.innerHTML = '<option value="">Selecione um cliente</option>';
  clientes.forEach(cliente => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
  if (clientes.some(c => String(c.id) === selecionadoAntes)) select.value = selecionadoAntes;
  aviso.classList.toggle("escondido", clientes.length > 0);
}

function salvarPedido(event) {
  event.preventDefault();
  const clienteId = Number(document.getElementById("cliente").value);
  const cliente = clientes.find(c => Number(c.id) === clienteId);
  const descricao = document.getElementById("pedido").value.trim();
  const categoria = document.getElementById("categoriaPedido").value;
  const status = document.getElementById("status").value;
  const valorTexto = document.getElementById("valorPedido").value;
  const enderecoDigitado = document.getElementById("enderecoPedido").value.trim();
  const enderecoBusca = localStorage.getItem("enderecoEntregaPadrao") || "";
  const endereco = enderecoDigitado || (cliente ? cliente.endereco : "") || enderecoBusca;

  if (!cliente) {
    alert("Cadastre e selecione um cliente antes de salvar o pedido.");
    return;
  }
  if (!descricao) {
    alert("Digite a descrição do pedido.");
    return;
  }

  pedidos.unshift({
    id: Date.now(),
    clienteId: cliente.id,
    cliente: cliente.nome,
    telefone: cliente.telefone,
    endereco,
    descricao,
    categoria,
    valor: valorTexto === "" ? null : Number(valorTexto),
    status,
    data: new Date().toLocaleString("pt-BR")
  });
  salvarDados("pedidos", pedidos);
  event.target.reset();
  document.getElementById("categoriaPedido").value = categoriaAtual || "Restaurante";
  document.getElementById("status").value = "Recebido";
  preencherClientes();
  mostrarPedidos();
  atualizarResumo();
  mostrarToast("Pedido salvo com sucesso!");
}

function classeStatus(status) {
  if (status === "Em preparo") return "status-preparo";
  if (status === "Saiu para entrega") return "status-entrega";
  if (status === "Entregue") return "status-entregue";
  return "status-recebido";
}

function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caractere]);
}

function mostrarPedidos() {
  const lista = document.getElementById("listaPedidos");
  if (!lista) return;
  const campo = document.getElementById("pesquisa");
  const termo = campo ? campo.value.trim().toLowerCase() : "";
  const filtrados = pedidos.filter(p => {
    const nome = String(p.cliente || "").toLowerCase();
    const descricao = String(p.descricao || p.pedido || "").toLowerCase();
    const categoria = String(p.categoria || "").toLowerCase();
    return (nome.includes(termo) || descricao.includes(termo) || categoria.includes(termo)) &&
      (!categoriaAtual || !p.categoria || p.categoria === categoriaAtual);
  });

  document.getElementById("contadorPedidos").textContent = filtrados.length;
  lista.innerHTML = "";
  if (filtrados.length === 0) {
    lista.innerHTML = '<div class="empty-state">Nenhum pedido encontrado. Cadastre um novo pedido ao lado.</div>';
    return;
  }

  filtrados.forEach(item => {
    const clienteAtual = clientes.find(c => Number(c.id) === Number(item.clienteId));
    const nomeCliente = item.cliente || (clienteAtual ? clienteAtual.nome : "Cliente");
    const telefone = item.telefone || (clienteAtual ? clienteAtual.telefone : "");
    const endereco = item.endereco || (clienteAtual ? clienteAtual.endereco : "Não informado");
    const descricao = item.descricao || item.pedido || "";
    const classe = classeStatus(item.status);
    const valor = item.valor == null || item.valor === "" ? "Não informado" :
      Number(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const card = document.createElement("article");
    card.className = `record-card order-record ${classe}`;
    card.innerHTML = `
      <div class="order-top">
        <strong>${escapar(nomeCliente)}</strong>
        <span class="status-pill ${classe}">${escapar(item.status || "Recebido")}</span>
      </div>
      <div class="order-meta">
        <span>📦 ${escapar(descricao)}</span>
        <span>🏷️ ${escapar(item.categoria || "Outro")}</span>
        <span>📞 ${escapar(telefone || "Telefone não informado")}</span>
        <span>📍 ${escapar(endereco || "Endereço não informado")}</span>
        <span>💰 ${escapar(valor)}</span>
        <span>🕒 ${escapar(item.data || "Data não informada")}</span>
      </div>
      <div class="order-controls">
        <select aria-label="Alterar status do pedido" onchange="alterarStatus(${item.id}, this.value)">
          ${["Recebido", "Em preparo", "Saiu para entrega", "Entregue"].map(s => `<option ${s === (item.status || "Recebido") ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        <button class="delete-button" type="button" onclick="excluirPedido(${item.id})">Excluir</button>
      </div>`;
    lista.appendChild(card);
  });
}

function alterarStatus(id, novoStatus) {
  const pedido = pedidos.find(p => Number(p.id) === Number(id));
  if (!pedido) return;
  pedido.status = novoStatus;
  salvarDados("pedidos", pedidos);
  mostrarPedidos();
  atualizarResumo();
  mostrarToast("Status do pedido atualizado.");
}

function excluirPedido(id) {
  if (!confirm("Deseja realmente excluir este pedido?")) return;
  pedidos = pedidos.filter(p => Number(p.id) !== Number(id));
  salvarDados("pedidos", pedidos);
  mostrarPedidos();
  atualizarResumo();
  mostrarToast("Pedido excluído.");
}

function atualizarResumo() {
  const total = document.getElementById("totalPedidos");
  if (!total) return;
  total.textContent = pedidos.length;
  document.getElementById("emPreparo").textContent = pedidos.filter(p => p.status === "Em preparo").length;
  document.getElementById("emEntrega").textContent = pedidos.filter(p => p.status === "Saiu para entrega").length;
  document.getElementById("entregues").textContent = pedidos.filter(p => p.status === "Entregue").length;
}

document.addEventListener("DOMContentLoaded", () => {
  preencherClientes();
  atualizarResumo();
});
