  const burger = document.querySelector('.hamburger');
  const plantInfo = document.getElementById('plantInfo');

  burger.addEventListener('click', () => {
    plantInfo.classList.toggle('show');
  });



  
  const toggle = document.querySelector('.dropdown-toggle');
  const menu = document.querySelector('.dropdown-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');

    
    if (menu.classList.contains('open')) {
      setTimeout(() => {
        menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200); 
    }
  });