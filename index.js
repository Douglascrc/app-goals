const { input, select, checkbox } = require('@inquirer/prompts');
const { fs } = require('fs').promises;

let goal = {
  value: String,
  checked: Boolean
}

let message = "Bem vindo ao App para gerenciar suas metas!";

let goals = [goal];

const addGoal = async() => {
  const goal = await input({ message: "Digite uma meta: " });

  if(goal.length == 0) {
    message = 'A meta não pode ser vazia';
    return
  }
  goals.push({ 
    value: goal,
    checked: false
   });
  console.log('A meta foi cadastrada com sucesso!');
}

const listGoals = async() => { 

  if(goals.length == 0) {
    message == 'Não há metas';
    return
  }

  const answers = await checkbox({
    message: 'Use as setas para se mover, e o espaço par marcar ou desmarcar e o Enter para finalizar a etapa.',
    choices: [...goals],
    instructions: false
  });

  goals.forEach((m) => {
    m.checked = false
  });

  if(answers.length == 0) {
    message = 'Não há metas selecionadas';
  }

  answers.forEach((answer) => {
    const go = goals.find((m) => {
      return m.value == answer;
    });

    go.checked = true;

  });

  message = 'Meta(s) marcada(s) com sucesso!';
}

const listOpenGoals = async() => {
  const goalOpen = goals.filter((m) =>{
    return m.checked != true
  });

  if(goalOpen == 0) {
    message = 'Não há metas pendentes';
  }
  
  await select({
    message: "Metas abertas: " + goalOpen.length,
    choices: [...goalOpen]
  });

};

const listGoalsDone = async() => {
  const goalDone = goals.filter((goal) => {
    return goal.checked 
  })

  if(goalDone.length == 0) {
    message = "Não existem metas realizadas! :(";
  }

  await select({
    message: "Metas Realizadas: " + goalDone.length,
    choices: [...goalDone]
  })
}

const deleteGoals = async() => {
  if(goals.length == 0) {
    message = "Não existem metas à deletar!"
    return
  }
  const goalsUnchecked = goals.map((m) => {
    return { value: m.value, checked: false }
  });

  const itemsForDelete = await checkbox({
    message: "Selecione um item para deletar",
    choices:[...goalsUnchecked],
    instructions: false
  });

 if (itemsForDelete.length == 0 ) {
    message = "Nenhum item para deletar!"
    return
 }
 itemsForDelete.forEach((item) => {
  goals = goals.filter((goal) => {
    return goal.value != item
    });
  });
  message = "Meta(s) deleta(s) com sucesso!";
}

const showMessage = (() => {
  console.clear();
  if(message != "") {
    console.log(message);
    console.log("")
  }
    
});

const start = async() => {
  while(true) {
    showMessage();

    const option = await select({
      message: "Menu >",
       choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name: "listar metas abertas",
          value: "Metas abertas"
        },
        {
          name: "Listar metas realizadas",
          value: "Metas realizadas"
        },
        {
          name: "Deletar metas",
          value: "deletar"
        },
        {
          name: "Sair",
          value: "sair"
        }
      ]
    })

    switch (option) {
      case "cadastrar":
          await addGoal();
        break;
      
      case "listar":
          await listGoals();
        break;
      case "Metas abertas":
        await listOpenGoals();
        break;
      case "Metas realizadas":
        await listGoalsDone();
        break;
      case "deletar":
        await deleteGoals();
        break;
      case "sair":
        console.log('Até a próxima');
      return;  
    }
  }
}

start();