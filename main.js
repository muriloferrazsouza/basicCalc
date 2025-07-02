const buttons = document.querySelectorAll('#btn');
const resultInput = document.querySelector('#resultbox');
const equalInput = document.querySelector('#equal');
const clearInput = document.querySelector('.clear')

let clearValue = 0;
let btnValue;

const simpleEval = (expression) => {
  // 1. Split expression into tokens (numbers and operators)
  const tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/)/g);
  if (!tokens) return 0;

  // 2. Handle * and /
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const operator = tokens[i];
      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);
      const result = operator === '*' ? left * right : left / right;

      // Replace the three tokens (left operator right) with the result
      tokens.splice(i - 1, 3, result.toString());

      // Step back one to check for consecutive * or /
      i -= 1;
    }
  }

  // 3. Handle + and -
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumber = parseFloat(tokens[i + 1]);

    if (operator === '+') result += nextNumber;
    else if (operator === '-') result -= nextNumber;
  }

  return result;
}

buttons.forEach(button => {
  button.addEventListener('click', function() {
    const btnValue = this.value;
    
    // Não deixar múltiplos pontos em um número
    const currentValue = resultInput.value;
    const lastNumberMatch = currentValue.match(/(\d+\.?\d*)$/);
    const operators = ['+', '-', '*', '/'];

    // Validação: não começar com operador (exceto o '-')
    if (currentValue.length === 0 && operators.includes(btnValue) && btnValue !== '-') {
        return; // ignora
    }

    // Validação: não permitir dois operadores seguidos
    const lastChar = currentValue.slice(-1);
    if (operators.includes(lastChar) && operators.includes(btnValue)) {
        return; // ignora
    }
    
    if (btnValue === '.') {
      // Se já existe ponto no último número, ignore
      if (lastNumberMatch && lastNumberMatch[0].includes('.')) {
        return; // ignora esse clique
      }
      // Se não tem número ainda, pode adicionar '0.'
      if (!lastNumberMatch) {
        resultInput.value += '0';
      }
    }

    if(clearValue > 0){
        if(!operators.includes(btnValue)){
            clearValue = 0;
            resultInput.value = '';
        }else{
            clearValue = 0;
        }
    }
    
    resultInput.value += btnValue;
  });
});

equalInput.addEventListener('click', (a) => {
    a.preventDefault();

    const currentValue = resultInput.value;
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentValue.slice(-1);

    if(operators.includes(lastChar)){
        return;
    }

    try{
        const result = simpleEval(resultInput.value);
        resultInput.value = result;
        clearValue ++;
    } catch (error){
        resultInput.value = 'Erro!'  
        clearValue ++;
    }
})

clearInput.addEventListener('click', (b) => {
    b.preventDefault();
    resultInput.value = '';
    clearValue = 0;
})

document.addEventListener('keydown', (event) => {
  // Verifica se a tecla pressionada foi "Backspace"
  if (event.key === 'Backspace') {
    // Impede o comportamento padrão se necessário (ex: apagar campo sem foco)
    event.preventDefault();

    const current = resultInput.value;
    resultInput.value = current.slice(0, -1); // Remove o último caractere
  }
});