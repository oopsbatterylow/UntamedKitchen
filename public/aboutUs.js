
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
      role: "Webiste designer and developer",
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
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Field research lead;focused on community interviews and local food mapping",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " grp t koi diba aru aru pto u di diba",
        email: "koi diba"
      }
    },
      shruti: {
      name: "Shruit Pritom Baruah",
      role: "Illustrator and storyteller",
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Illustrator andstoryteller; added visuals and cultural context.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " janu ai bru phir bhi di dibi aru pto dibi fool",
        email: "koi dibi"
      }
    },
      nishita: {
      name: "Nishita Bora",
      role: "content designer",
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "– Language and content designer; crafted engaging narratives for children.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " grp t koi diba aru aru pto u di diba",
        email: "koi diba"
      }
    },
      anushka: {
      name: "Anushka Singh Boraik",
      role: "Creative lead",
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Creative lead; worked on visual design and child-friendly recipe formats.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " grp t koi diba aru aru pto u di diba",
        email: "koi diba"
      }
    },
      priya: {
      name: "Priya Sarkar",
      role: "Data compiler",
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Data compiler; worked on nutritional charts and food suitability.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " di dibiiiiiii aru pto dibi hunkale",
        email: "koi dibi"
      }
    },
      ayushman: {
      name: "Ayushman Bharadwaj",
      role: "Recipe standardizer",
      image: "/images/team/bijayananda.jpg",
      bg: "/images/bg/bijayananda-bg.jpg",
      work: "Recipe standardizer; adapted local dishes into easy, healthy formats.",
      about: "A pol science major student of 5th sem  studing in Jagannath Barooah University (as per as july 2025).",
      contact: {
        phone: " grp t koi diba aru aru pto u di diba",
        email: "koi diba"
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
