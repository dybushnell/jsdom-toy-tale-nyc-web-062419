const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false


const createForm = document.querySelector("#create-form")
const toyCollection = document.querySelector("#toy-collection")



addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
})


fetch("http://localhost:3000/toys")
  .then(function (response) {
    return response.json()
  })
  .then(function (toys) {
    toys.forEach(toy => {
      newToy(toy)
    });
  })


function newToy(toyObj) {
  toyCollection.insertAdjacentHTML("beforeend", `
  <div class="card" id ="${toyObj.id}"> 
  <h2>${toyObj.name}</h2>
  <img class="toy-avatar" src="${toyObj.image}"/>
  <p>${toyObj.likes} likes</p>
  <button class="like-btn" id="like-btn-${toyObj.id}">Andy like!</button>
  </div>
  `)
}

createForm.addEventListener("submit", function (event) {
  event.preventDefault();
  postToyData(event.target);
})

function postToyData(form) {
  fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: form.name.value,
        image: form.image.value,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(json => newToy(json))
  form.reset();
  toyForm.style.display = 'none'

}

document.addEventListener("click", function (e) {
  if (e.target.classList.value === "like-btn") {
    let toyLiked = e.target.parentElement
    const id = toyLiked.id
    let likes = parseInt(toyLiked.querySelector("p").innerText)
    likes += 1;
    patchToyData(id, likes)
  }
})


function patchToyData(idArg, likeArg) {
  fetch(`http://localhost:3000/toys/${idArg}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: likeArg
      })
    })
    .then(response => response.json())
    .then(json => updateToy(json))

}

function updateToy(toy) {
  let foundToy = toyCollection.querySelectorAll("div.card");
  foundToy.forEach(function (div) {
    if (div.id == toy.id) {
      div.querySelector("p").innerText = `${toy.likes} Likes`;
    }
  });
}