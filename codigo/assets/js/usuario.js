$(document).ready(function () {
  let usuarioAtual = null;

  async function buscarUser() {
    try {
      const response = await axios.get('http://localhost:3000/logado');
      usuarioAtual = response.data[0];
      console.log(usuarioAtual.fotoPerfil);
      $('#usuario').text(`${usuarioAtual.nome.primeiroNome} ${usuarioAtual.nome.ultimoNome}`);
      $('#UserLogado').attr('placeholder', `${usuarioAtual.nome.primeiroNome} ${usuarioAtual.nome.ultimoNome}`);
      if (usuarioAtual.fotoPerfil === "") {
        $('#ftSaldacao').attr('src', 'https://sistemas.ft.unicamp.br/sgpg/imagens/sem_foto.png');
        $('#ftPerfil').attr('src', 'https://sistemas.ft.unicamp.br/sgpg/imagens/sem_foto.png');
      } else {
        $('#ftSaldacao').attr('src', usuarioAtual.fotoPerfil);
        $('#ftPerfil').attr('src', usuarioAtual.fotoPerfil);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  }

  buscarUser();

  $('#btn-ft').on('click', function () {
    $('#ftInput').click();
  });

  $('#ftInput').on('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const jpegDataUrl = canvas.toDataURL('image/jpeg'); // Converte para JPEG
          $('#ftPerfil').attr('src', jpegDataUrl);
          $('#ftSaldacao').attr('src', jpegDataUrl);
          usuarioAtual.fotoPerfil = jpegDataUrl;
        };
        img.src = e.target.result; // Define o src da imagem
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    }
  });

  $('#editUser').on('click', function () {
    $('#UserLogado').prop('disabled', false).focus();
  });

  $('#btnSalvar').on('click', async function () {
    try {
      await axios.put(`http://localhost:3000/logado/${usuarioAtual.id}`, usuarioAtual, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      swal.fire({
        title: 'Alterações salvas com sucesso',
        icon: 'success',
        text: ""
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    } catch (error) {
      console.error('Error:', error);
      swal.fire({
        title: 'Erro ao salvar alterações',
        icon: 'error',
        text: ""
      });
    }
  });
});
