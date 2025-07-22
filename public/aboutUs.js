
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}
function showMember(memberId) {
  const detail = document.getElementById("member-detail");
  const bg = document.querySelector(".background-blur");
  if (window.innerWidth < 768) {
  document.getElementById("sidebar").classList.remove("open");
}


  const data = {
     rajlaxmi: {
      name: "Rajlaxmi Rajkonwari",
      role: "Website designer and developer",
      image: "/images/rajlaxmi.jpg",
      bg: "public\images\rajlaxmi.jpg",
      work: " Editorial Head, ensured nutritional and scientific accuracy.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025)",
    //   address:{
    //     cuurentAddress: "Titabar, Jorhat (Assam)",
    //     parmanentAddress: "Titabar, Jorhat(Assam)"

    //   },
      contact: {
        phone: "+91-9395320519",
        email: "rajlaxmikonwar641@gmail.com"
      }
    },
    bijayananda: {
      name: "Bijayananda Bora",
      role: "Field Research Lead",
      image: "/images/bijoy.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Field research lead;focused on community interviews and local food mapping",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " 9678035934",
        email: " bjy247@gmail.com"
      }
    },
      shruti: {
      name: "Shruit Pritom Baruah",
      role: "Illustrator and storyteller",
      image: "/images/shruit.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Illustrator andstoryteller; added visuals and cultural context.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: "9394574800",
        email: "shrutiboruah270@gmail.com"
      }
    },
      nishita: {
      name: "Nishita Bora",
      role: "content designer",
      image: "/images/nixita.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "– Language and content designer; crafted engaging narratives for children.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: "8099173147",
        email: "miss.nishita07@gmail.com"
      }
    },
      anushka: {
      name: "Anuska Singh Boraik",
      role: "Creative lead",
      image: "/images/anushka.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Creative lead; worked on visual design and child-friendly recipe formats.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: "9395366363",
        email: "not defined"
      }
    },
      priya: {
      name: "Priya Sarkar",
      role: "Data compiler",
      image: "/images/priya.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Data compiler; worked on nutritional charts and food suitability.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: "9395364778",
        email: "priyasarkar93953@gmail.com"
      }
    },
      ayushman: {
      name: "Ayushman Bharadwaj",
      role: "Recipe standardizer",
      image: "/images/ayushman.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Recipe standardizer; adapted local dishes into easy, healthy formats.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: "8638904507",
        email: " "
      }
    },
   
    
  };

  const person = data[memberId];

  // Change background image
  bg.style.backgroundImage = `url('${person.bg}')`;

  // Update profile section
  detail.innerHTML = `
    <h2>${person.name}</h2>
    <h4>${person.role}</h4>
    <div class="member-profile">
      <div class="member-info">
        <p>${person.work}</p>
        <p>${person.about}</p>
        <div class="contact-info">
          <h5>Contact Info:</h5>
          <p><strong>Phone:</strong> ${person.contact.phone}</p>
          <p><strong>Email:</strong> ${person.contact.email}</p>
        </div>
      </div>
      <div class="member-photo">
        <img src="${person.image}" alt="${person.name}">
      </div>
    </div>
  `;
}
