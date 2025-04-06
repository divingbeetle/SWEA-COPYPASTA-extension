function showTestNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `test-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Create copy handler
async function handleCopy(link, type) {
  try {
    if (!link) {
      throw new Error(`${type} link not found`);
    }
    const response = await fetch(link.href);
    if (response.redirected) {
      throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    await navigator.clipboard.writeText(data);
    showTestNotification(`${type} copied to clipboard!`, 'success');
  } catch (error) {
    console.error('Error:', error);
    showTestNotification(`Failed to copy ${type}: ${error.message}`, 'error');
  }
}

function createButton(text, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = `test-button ${className}`;
  return button;
}

// Main function to add buttons
function addCopyButtons() {
  // SWEA uses box_type1 class for input and output
  // left class for input and right class for output
  const inputDiv = document.querySelector('.box_type1 .left');
  const outputDiv = document.querySelector('.box_type1 .right');

  if (!inputDiv || !outputDiv) {
    console.log('Input and output not found');
    return;
  }

  // Title of input and output: would be used to append buttons
  const inputDivTitle = inputDiv.querySelector('.title1');
  const outputDivTitle = outputDiv.querySelector('.title1');
  
  if (!inputDivTitle || !outputDivTitle) {
    console.log('Input and output title not found');
    return;
  }

  const inputButton = createButton('Copy Input', 'input');
  inputButton.addEventListener('click', (event) => {
    const inputLink = inputDiv.querySelector("a[href*='downType=in']");
    handleCopy(inputLink, 'Input');
  });
  inputDivTitle.appendChild(inputButton);

  const outputButton = createButton('Copy Output', 'output');
  outputButton.addEventListener('click', (event) => {
    const outputLink = outputDiv.querySelector("a[href*='downType=out']");
    handleCopy(outputLink, 'Output');
  });
  outputDivTitle.appendChild(outputButton);

  // Finally
  console.log('Buttons added!');
}

// Add buttons on page load
console.log('Content script loaded');
addCopyButtons();
