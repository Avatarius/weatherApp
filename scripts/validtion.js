function enableValidation(settingsObj) {
  const formList = Array.from(
    document.querySelectorAll(settingsObj.formSelector)
  );
  formList.forEach((formElement) => {
    setEventListeners(formElement, settingsObj);
  });
}

function setEventListeners(formElement, settingsObj) {
  const inputList = Array.from(
    formElement.querySelectorAll(settingsObj.inputSelector)
  );
  const submitButton = formElement.querySelector(
    settingsObj.submitButtonSelector
  );
  toggleButton(inputList, submitButton, settingsObj.inactiveButtonClass);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settingsObj);
      toggleButton(inputList, submitButton, settingsObj.inactiveButtonClass);
    });
  });
}

function checkInputValidity(formElement, inputElement, settingsObj) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.patternMismatchError);
  } else {
    inputElement.setCustomValidity("");
  }
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!inputElement.validity.valid) {
    showInputError(
      inputElement,
      errorElement,
      settingsObj.errorActiveClass,
      settingsObj.inputErrorClass
    );
  } else {
    hideInputError(
      inputElement,
      errorElement,
      settingsObj.errorActiveClass,
      settingsObj.inputErrorClass
    );
  }
}

function reportWrongLocation(errorElement, inputElement, settingsObj) {
  inputElement.setCustomValidity(inputElement.dataset.wrongLocationError);
  showInputError(
    inputElement,
    errorElement,
    settingsObj.errorActiveClass,
    settingsObj.inputErrorClass
  );
}

function showInputError(
  inputElement,
  errorElement,
  errorActiveClass,
  inputErrorClass
) {
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(errorActiveClass);
  inputElement.classList.add(inputErrorClass);
}

function hideInputError(
  inputElement,
  errorElement,
  errorActiveClass,
  inputErrorClass
) {
  errorElement.textContent = "";
  errorElement.classList.remove(errorActiveClass);
  inputElement.classList.remove(inputErrorClass);
}

function hasInvalidInput(inputList) {
  const invalidInput = inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });

  return invalidInput;
}

function toggleButton(inputList, submitButton, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    submitButton.classList.add(inactiveButtonClass);
  } else {
    submitButton.classList.remove(inactiveButtonClass);
  }
}

export { enableValidation, reportWrongLocation };
