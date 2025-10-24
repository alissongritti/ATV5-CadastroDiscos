// URL da nossa API Backend
const API_URL = "/api/discos";

// Seleciona os elementos do DOM
const form = document.getElementById("formDisco");
const tabelaCorpo = document.getElementById("corpoTabela");
const discoIdInput = document.getElementById("discoId");
const tituloInput = document.getElementById("titulo");
const artistaInput = document.getElementById("artista");
const anoInput = document.getElementById("ano");
const generoInput = document.getElementById("genero");
const formatoInput = document.getElementById("formato");
const precoInput = document.getElementById("preco");
const btnCancelar = document.getElementById("btnCancelar");
const notification = document.getElementById("notification"); // Pega o elemento da notificação

// Variável para guardar o estado de edição
let editando = false;
let notificationTimer = null; // Timer para a notificação

// --- FUNÇÃO: Mostrar Notificação ---
function showNotification(message, type = "success") {
  // Limpa qualquer timer anterior para não sumir rápido demais
  if (notificationTimer) {
    clearTimeout(notificationTimer);
  }

  notification.textContent = message;
  notification.className = type; // Adiciona a classe 'success' ou 'error'

  // Adiciona a classe 'show' para fazer a notificação aparecer
  notification.classList.add("show");

  // Define um timer para esconder a notificação depois de 3 segundos
  notificationTimer = setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// --- FUNÇÃO: Listar (Read) ---
async function listarDiscos() {
  tabelaCorpo.innerHTML = "";
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const discos = await response.json();

    discos.forEach((disco) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${disco.titulo}</td>
                <td>${disco.artista}</td>
                <td>${disco.ano}</td>
                <td>${disco.genero || ""}</td>
                <td>${disco.formato}</td>
                <td>R$ ${disco.preco.toFixed(2)}</td>
                <td>
                    <span class="btn-editar">Editar</span>
                    <span class="btn-excluir">Excluir</span>
                </td>
            `;

      const btnEditar = tr.querySelector(".btn-editar");
      const btnExcluir = tr.querySelector(".btn-excluir");

      btnEditar.addEventListener("click", () => {
        prepararEdicao(disco._id);
      });

      btnExcluir.addEventListener("click", () => {
        excluirDisco(disco._id);
      });

      tabelaCorpo.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar discos:", error);
    showNotification("Falha ao carregar discos.", "error");
  }
}

// --- FUNÇÃO: Salvar (Create/Update) ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dadosDisco = {
    titulo: tituloInput.value,
    artista: artistaInput.value,
    ano: parseInt(anoInput.value),
    genero: generoInput.value,
    formato: formatoInput.value,
    preco: parseFloat(precoInput.value),
  };

  let url = API_URL;
  let method = "POST";

  if (editando) {
    const id = discoIdInput.value;
    url = `${API_URL}/${id}`;
    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosDisco),
    });

    if (response.ok) {
      showNotification(
        `Disco ${editando ? "atualizado" : "salvo"} com sucesso!`,
        "success"
      );
      resetarFormulario();
      listarDiscos();
    } else {
      showNotification("Erro ao salvar o disco.", "error");
    }
  } catch (error) {
    console.error("Erro ao salvar:", error);
    showNotification("Erro de conexão ao salvar.", "error");
  }
});

// --- FUNÇÃO: Preparar Edição (Update) ---
async function prepararEdicao(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Disco não encontrado.");
    }
    const disco = await response.json();

    tituloInput.value = disco.titulo;
    artistaInput.value = disco.artista;
    anoInput.value = disco.ano;
    generoInput.value = disco.genero;
    formatoInput.value = disco.formato;
    precoInput.value = disco.preco;
    discoIdInput.value = disco._id;

    editando = true;
    btnCancelar.style.display = "inline";

    tituloInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Erro ao preparar edição:", error);
    showNotification("Erro ao carregar dados para edição.", "error");
  }
}

// --- FUNÇÃO: Excluir (Delete) ---
async function excluirDisco(id) {
  if (confirm("Tem certeza que deseja excluir este disco?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("Disco excluído com sucesso!", "success");
        listarDiscos();
      } else {
        showNotification("Erro ao excluir o disco.", "error");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      showNotification("Erro de conexão ao excluir.", "error");
    }
  }
}

// --- FUNÇÃO: Resetar Formulário ---
function resetarFormulario() {
  form.reset();
  discoIdInput.value = "";
  editando = false;
  btnCancelar.style.display = "none";
}

// --- Evento de clique no botão Cancelar ---
btnCancelar.addEventListener("click", resetarFormulario);

// --- Inicialização ---
listarDiscos();
