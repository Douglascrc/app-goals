const { input, select, checkbox } = require('@inquirer/prompts');

let goal = {
  value: String,
  checked: Boolean
}

let message = "Bem vindo ao App para gerenciar suas metas!";

let goals = [goal];

const addGoal = async() => {
  const goal = await input({ message: "Digite uma meta: " });

  if(goal.length == 0) {
    console.log('A meta não pode ser vazia');
    return
  }
  goals.push({ 
    value: goal,
    checked: false
   });
  console.log('A meta foi cadastrada com sucesso!');
}

const listGoals = async() => {
  const respostas = await checkbox({
    message: 'Use as setas para se mover, e o espaço par marcar ou desmarcar e o Enter para finalizar a etapa.',
    choices: [...goals],
    instructions: false
  });

  goals.forEach((m) => {
    m.checked = false
  });

  if(respostas.length == 0) {
    console.log('Não há metas cadastradas');
  }

  goals.forEach((respostas) => {
    const goal = goals.find((m) => {
      return m.value == respostas;
    });

  });
}

const listOpenGoals = async() => {
  const goalOpen = goals.filter((m) =>{
    return m.checked != true
  });

  if(goalOpen == 0) {
    console.log('Não há metas pendentes');
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
    message = "Não existem metas!"
  }
  const goalsUnchecked = goals.map((m) => {
    return m.checked == false
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

const start = async() => {
  while(true) {
    

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