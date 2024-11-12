import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    
    // Insere os novos dados
    await knex('items').insert([
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Pilhas e baterias', image: 'baterias.svg' },
        { title: 'Papeis e papelões', image: 'papeis-papelao.svg' },
        { title: 'Residuos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Residuos Orgânicos', image: 'organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' },
    ]);
}
