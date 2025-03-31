using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiarios bo = new BoBeneficiarios();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                string cpf = model.CPF.Replace(".", "").Replace("-", "");

                if (!ValidarCpf(cpf))
                    throw new InvalidOperationException("CPF inválido.");

                if (bo.VerificarExistencia(cpf))
                    throw new InvalidOperationException("Já existe um cliente cadastrado com este CPF.");


                model.Id = bo.Incluir(new Beneficiario()
                {
                    CPF = cpf,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });


                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiarios bo = new BoBeneficiarios();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                string cpf = model.CPF.Replace(".", "").Replace("-", "");

                if (!ValidarCpf(cpf))
                    throw new InvalidOperationException("CPF inválido.");

                bo.Alterar(new Beneficiario()
                {
                    CPF = cpf,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente,
                    Id = model.Id
                });

                return Json(new { success = true, message = "Cadastro alterado com sucesso" });
            }
        }

        [HttpPost]
        public JsonResult Excluir(long id)
        {
            try
            {
                BoBeneficiarios boBen = new BoBeneficiarios();
                boBen.Excluir(id);
                return Json("Beneficiário deletado com sucesso.");
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult Listar(long idCliente)
        {
            try
            {
                List<Beneficiario> ben = new BoBeneficiarios().Listar(idCliente);
                return Json(ben, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public bool ValidarCpf(string cpf)
        {
            if (cpf.Length != 11 || cpf.All(c => c == cpf[0]))
                return false;

            int CalcularDigito(int posicoes)
            {
                int soma = 0;
                for (int i = 0; i < posicoes; i++)
                    soma += (cpf[i] - '0') * (posicoes + 1 - i);

                int resto = soma % 11;
                return resto < 2 ? 0 : 11 - resto;
            }

            return CalcularDigito(9) == (cpf[9] - '0') &&
                   CalcularDigito(10) == (cpf[10] - '0');
        }
    }
}