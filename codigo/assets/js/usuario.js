$(document).ready(function () {
  let usuarioAtual = null;

  async function buscarUser() {
    try {
      const response = await axios.get("http://localhost:3000/logado");
      usuarioAtual = response.data[0];
      $("#usuario").text(
        `${usuarioAtual.nome.primeiroNome} ${usuarioAtual.nome.ultimoNome}`
      );
      $("#UserLogado").attr(
        "placeholder",
        `${usuarioAtual.nome.primeiroNome} ${usuarioAtual.nome.ultimoNome}`
      );
      $("#EmailUser").attr("placeholder", `${usuarioAtual.email}`);
      $("#NameUniversidade").attr(
        "placeholder",
        `${usuarioAtual.nomeuniversidade}`
      );
      if (usuarioAtual.fotoPerfil === "") {
        $("#ftSaldacao").attr(
          "src",
          "https://sistemas.ft.unicamp.br/sgpg/imagens/sem_foto.png"
        );
        $("#ftPerfil").attr(
          "src",
          "https://sistemas.ft.unicamp.br/sgpg/imagens/sem_foto.png"
        );
      } else {
        $("#ftSaldacao").attr("src", usuarioAtual.fotoPerfil);
        $("#ftPerfil").attr("src", usuarioAtual.fotoPerfil);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  buscarUser();

  $("#btn-ft").on("click", function () {
    $("#ftInput").click();
  });

  $("#ftInput").on("change", function (e) {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = function (e) {
        const UrlBase64 = e.target.result;
        $("#ftPerfil").attr("src", UrlBase64);
        $("#ftSaldacao").attr("src", UrlBase64);
        usuarioAtual.fotoPerfil = UrlBase64;
      };
      leitor.readAsDataURL(arquivo);
    }
  });

  $("#editUser").on("click", function () {
    var isDisabled = $("#UserLogado").prop("disabled");
    $("#UserLogado").prop("disabled", !isDisabled).focus();
  });
  $("#UserLogado").on("change", function (e) {
    const nomeCompleto = e.target.value;
    const nomes = nomeCompleto.split(" ");

    if (nomes.length >= 2) {
      usuarioAtual.nome.primeiroNome = nomes[0];
      usuarioAtual.nome.ultimoNome = nomes[1];
    } else {
      usuarioAtual.nome.primeiroNome = nomes[0];
      usuarioAtual.nome.ultimoNome = "";
    }
  });

  $("#editEmail").on("click", function () {
    var isDisabled = $("#EmailUser").prop("disabled");
    $("#EmailUser").prop("disabled", !isDisabled).focus();
  });
  $("#EmailUser").on("change", function (e) {
    const Email = e.target.value;
    if (Email.length != 0) {
      usuarioAtual.email = Email;
    } else {
      usuarioAtual.email = usuarioAtual.email;
    }
  });

  $("#editNameUni").on("click", function () {
    var isDisabled = $("#NameUniversidade").prop("disabled");
    $("#NameUniversidade").prop("disabled", !isDisabled).focus();
  });
  $("#NameUniversidade").on("change", function (e) {
    const NameUniversidade = e.target.value;
    if (NameUniversidade.length != 0) {
      usuarioAtual.nomeuniversidade = NameUniversidade;
    } else {
      usuarioAtual.nomeuniversidade = usuarioAtual.nomeuniversidade;
    }
  });

  $("#btnSalvar").on("click", async function () {
    try {
      await axios.put(
        `http://localhost:3000/logado/${usuarioAtual.id}`,
        usuarioAtual,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      swal
        .fire({
          title: "Alterações salvas com sucesso",
          icon: "success",
          text: "",
        })
        .then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
    } catch (error) {
      console.error("Error:", error);
      swal.fire({
        title: "Erro ao salvar alterações",
        icon: "error",
        text: "",
      });
    }
  });

  $("#btnDeslogar").on("click", async function () {
    const apiUrl = "http://localhost:3000/logado";

    try {
      const res = await axios.get(apiUrl);
      const logins = res.data;

      localStorage.removeItem(logins);
      const deletePromises = logins.map((login) =>
        axios.delete(`${apiUrl}/${login.id}`)
      );
      await Promise.all(deletePromises);
      swal
        .fire({
          title: "Logout realizado com sucesso",
          text: "Você foi deslogado do sistema.",
          icon: "success",
          confirmButtonText: "Ok",
        })
        .then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
          }
        });
    } catch (error) {
      console.error("Erro ao deslogar", error);

      Swal.fire({
        title: "Erro ao deslogar",
        text: "Ocorreu um erro ao tentar deslogar. Por favor, tente novamente.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  });

  $('#btnGoHome').on('click', function() {
    window.location.href = 'calendario.html';
});


});
