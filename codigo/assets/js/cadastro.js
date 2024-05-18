$(document).ready(function () {

    //mascara CPF
    $(document).on('input', '#cpf', function() {
        let value = $(this).val();

        value = value.replace(/\D/g, '').substring(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        $(this).val(value);
    });

    $('#checkedBox input[name="role"]').change(function () {
        var isParticipante = $('#participante').is(':checked');

        if (isParticipante) {
            $('#imputOrganizador').remove();
        } else {
            if (!$('#imputOrganizador').length) {
                var imputOrganizadorHtml = `
                    <div class="row" id="imputOrganizador">
                      <div class="col-md-6 mb-3">
                        <div class="input-group">
                          <span class="input-group-text"><i class="bi bi-building"></i></span>
                          <input type="text" class="form-control" id="vinculo" placeholder="Vínculo com a instituição" required maxlength="14">
                        </div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <div class="input-group">
                          <span class="input-group-text"><i class="bi bi-card-list"></i></span>
                          <input type="text" class="form-control" id="cpf" placeholder="CPF" required>
                        </div>
                      </div>
                    </div>
                `;
                $('#alertContainer').before(imputOrganizadorHtml);
            }
        }
    });

    if ($('#participante').is(':checked')) {
        $('#imputOrganizador').remove();
    } else {
        if (!$('#imputOrganizador').length) {
            var imputOrganizadorHtml = `
                <div class="row" id="imputOrganizador">
                  <div class="col-md-6 mb-3">
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-building"></i></span>
                      <input type="text" class="form-control" id="vinculo" placeholder="Vínculo com a instituição" required maxlength="14">
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-card-list"></i></span>
                      <input type="text" class="form-control" id="cpf" placeholder="CPF" required>
                    </div>
                  </div>
                </div>
            `;
            $('#alertContainer').before(imputOrganizadorHtml);
        }
    }

    $('#btnCadastro').click(function () {

        let Validado = ImputValidation();

        if (Validado) {
            var DbCadastro = {
                nome: {
                    primeiroNome: $('#PrimeiroNome').val(),
                    ultimoNome: $('#UltimoNome').val()
                },
                email: $('#email').val(),
                senha: CryptoJS.MD5($('senha').val()).toString(),
                nomeuniversidade: $('#nomeuniversidade').val(),
                universidadeID: $('#universidadeID').val(),
                TipoUsuario: $('input[name="role"]:checked').val(),
                vinculo: $('#vinculo').val(),
                cpf: $('#cpf').val()
            };

            console.log(DbCadastro);

            swal.fire({
                title: 'Cadastro realizado com sucesso',
                icon:'success'
            }).then((result => {
                if(result.isConfirmed){
                    window.location.href = 'calendario.html';
                }
            }))

            fetch('http://localhost:3000/cadastros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(DbCadastro)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);       
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }



    });


    function ImputValidation() {

        let inputvalido = true;
        $('input[required]').each(function () {
            if ($(this).val() === '') {
                ShowAlert(`O campo ${$(this).attr('placeholder')} é obrigatório.`, "danger");
                inputvalido = false;
                return false;
            }
        });

        if (!inputvalido) { return false; }

        if ($('#confirmEmail').val() !== $('#email').val()) {
            ShowAlert("Os endereços de email não se coincidem. Por favor, verifique e tente novamente.", "danger");
            return false;
        }

        if (!$('#email').val().split('').includes('@') ) {
            ShowAlert("Os endereços de email não se coincidem. Por favor, verifique e tente novamente.", "danger");
            return false;
        }

        if ($('#senha').val() !== $('#confirmSenha').val()) {
            ShowAlert("As senhas não coincidem. Por favor, verifique e tente novamente.", "danger");
            return false;
        }

        if ($('#senha').val().length < 5) {
            ShowAlert("Senha muito fraca", "danger");
            return false;
        }


        if ($('#imputOrganizador').length){
            if ($('#cpf').val().length != 14) {
                ShowAlert("CPF invalido, CPF possui 11 digitos.", "danger");
                return false;
            }
        }
    
        return true;

    }

    
    function ShowAlert(message, type = "danger") {
        let alertContainer = $("#alertContainer");

        let alertDiv = $(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        alertContainer.append(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

});