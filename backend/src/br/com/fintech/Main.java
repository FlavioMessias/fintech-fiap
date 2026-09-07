package br.com.fintech;

import br.com.fintech.model.Categoria;
import br.com.fintech.model.Entrada;
import br.com.fintech.model.FormaPagamento;
import br.com.fintech.model.MetaFinanceira;
import br.com.fintech.model.Saida;
import br.com.fintech.model.Transacao;
import br.com.fintech.model.Usuario;

import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) {

        Usuario usuario = new Usuario(
                1,
                "Flavio Messias",
                "flavio@email.com",
                "11999999999"
        );

        Categoria categoriaSalario = new Categoria(
                1,
                "Salário",
                "Entrada",
                "Recebimento mensal do usuário."
        );

        Categoria categoriaAlimentacao = new Categoria(
                2,
                "Alimentação",
                "Saída",
                "Gastos com mercado e comida."
        );

        FormaPagamento pix = new FormaPagamento(
                1,
                "Pix",
                "Pagamento instantâneo.",
                true
        );

        Entrada entrada = new Entrada(
                1,
                3000.00,
                "Salário mensal",
                "07/09/2026",
                categoriaSalario,
                pix,
                "Empresa"
        );

        Saida saida = new Saida(
                2,
                250.00,
                "Compra no mercado",
                "07/09/2026",
                categoriaAlimentacao,
                pix,
                "Alimentação",
                false
        );

        MetaFinanceira meta = new MetaFinanceira(
                1,
                "Reserva de emergência",
                "Guardar dinheiro para situações inesperadas.",
                5000.00,
                1000.00,
                "01/09/2026",
                "31/12/2026"
        );

        usuario.adicionarTransacao(entrada);
        usuario.adicionarTransacao(saida);
        usuario.adicionarMeta(meta);

        meta.adicionarValor(500.00);

        System.out.println("===== DADOS DO USUÁRIO =====");
        System.out.println(usuario.exibirResumoFinanceiro());

        System.out.println("\n===== META FINANCEIRA =====");
        System.out.println(meta.exibirMeta());

        System.out.println("\n===== POLIMORFISMO =====");

        List<Transacao> transacoes = new ArrayList<>();
        transacoes.add(entrada);
        transacoes.add(saida);

        for (Transacao transacao : transacoes) {
            System.out.println("\n" + transacao.exibirResumo());
        }

        System.out.println("\n===== SALDO FINAL =====");
        System.out.println("Saldo calculado: R$ " + usuario.calcularSaldo());
    }
}