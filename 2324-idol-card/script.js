document.querySelector('button#me').addEventListener('click', () => {
  document.querySelector('#name').innerHTML = 'Voornaam Achternaam'
  document.querySelector('#birthday').innerHTML = '01-01-2000'
  document.querySelector('#birthplace').innerHTML = 'Utrecht'
  document.querySelector('#description').innerHTML = 'Maakt nu een introductie opdracht.'
})

document.querySelector('button#idol').addEventListener('click', () => {
  alert('Waardes zijn nog niet toegevoegd aan script.js. Vul de "Eventlistener" aan.')
  //document.querySelector('#name').innerHTML = 'Idol Name'
});