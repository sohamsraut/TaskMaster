"use strict";

(function() {

  window.addEventListener('load', init);
  let user;

  function init() {
    let login = qsa("a.login");
    let signup = qsa("a.signup");
    for (let i = 0; i < login.length; i++) {
      login[i].addEventListener("click", toggleViews);

      signup[i].addEventListener("click", () => {
        toggleViews();
        toggleNew();
      })
    }
    qs("h1").addEventListener("click", homeView);
    id("home").addEventListener("click", homeView);
    id("home-2").addEventListener("click", homeView);
    qs("#auth form").addEventListener('submit', loginCheck);
    id("new").addEventListener("click", toggleNew);
    id("back").addEventListener("click", toggleNew);
    id("new-task").addEventListener("click", newTaskPage);
    id("delete-task").addEventListener("click", deleteSelected);
  }

  function homeView() {
    id("intro-view").classList.add("hidden");
    id("task-view").classList.add("hidden");
    qs("header").classList.remove("hidden");
  }

  function toggleViews() {
    qs("header").classList.add("hidden");
    id("intro-view").classList.remove("hidden");
    id("new-user").classList.add("hidden");
    id("auth").classList.remove("hidden");
  }

  function loginCheck(event) {
    event.preventDefault();
    if (id("username").value && id("pass").value) {
      let data = new FormData();
      data.append("username", id("username").value);
      data.append("pass", id("pass").value);
      id("loading").classList.remove("hidden");
      fetch("tasks/all", {method: "POST", body: data})
        .then(statusCheck)
        .then(res => res.json())
        .then(showTasks)
        .catch(handleError);
    }
  }

  function showTasks(responseData) {
    id("intro-view").classList.add("hidden");
    id("task-view").classList.remove("hidden");
    id("loading").classList.add("hidden");
    user = responseData.user;
    for (let i = 0; i < responseData.length; i++) {
      id("task-cards").appendChild(createCard(responseData[i]));
    }
  }

  function createCard(task) {
    let card = gen("section");
    card.classList.add("card");
    card.id = task.taskId;

    let category = gen("p");
    category.classList.add("category");
    category.textContent = task.category;

    let desc = gen("p");
    desc.textContent = task.taskname;

    card.appendChild(category);
    card.appendChild(desc);
    card.addEventListener("click", function() {
      this.classList.toggle("selected");
    });
    return card;
  }

  function toggleNew() {
    id("auth").classList.toggle("hidden");
    id("new-user").classList.toggle("hidden");
    let inputs = qsa("#intro-view input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }

  function deleteSelected() {
    let selected = qsa(".selected");
    if (selected.length === 0) {
      id("message").textContent = "No tasks selected";
    } else {
      let data = new FormData();
      data.append("user", user);
    }
  }

  function handleError(error) {
    id("error-auth").classList.remove("hidden");
    id("error-auth").textContent = error;
  }

    /**
   * Checks the status of the data requested from the API, throws an error if there are problems.
   * @param {Promise} res : The response object after data is requested
   * @returns {Promise} : The response object passed (if there are no problems)
   */
     async function statusCheck(res) {
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res;
    }

    /**
     * Returns the element with the passed ID value
     * @param {string} idName : The id of the element
     * @returns {Element} : The object associated with the passed id
     */
    function id(idName) {
      return document.getElementById(idName);
    }

    /**
     * Returns the first element that matches the passed CSS selector
     * @param {string} selector : One or more CSS selectors to select elements
     * @returns {Element} : The first element matching the given selector
     */
    function qs(selector) {
      return document.querySelector(selector);
    }

    /**
     * Returns a list of elements that match with the passed CSS selectors
     * @param {String} selector : One or more CSS selectors to select elements
     * @returns {NodeList} : A list of elements that match the given CSS selector
     */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }

    /**
     * Returns a new element with the passed tag name
     * @param {string} tagName : The tag name for the new DOM element
     * @returns {Element} : a new element with the given tag name
     */
    function gen(tagName) {
      return document.createElement(tagName);
    }

})();