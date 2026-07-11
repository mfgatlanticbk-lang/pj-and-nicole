import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export const siteConfig = {
  couple: {
    bride: "Teri Nicole A. Guillermo", //Noenyl Bryle M. Gonzaga
    brideNickname: "PJ", //PJ
    groom: "Patrick James G. Javar", //Ltryl B. Benitez
    groomNickname: "Nicole",
    monogram:"/monogram/monogram.png" ,//Ltryl
    backgroundMusic:"/background_music/PALAGI (Wedding Version) - TJ Monterde  OFFICIAL AUDIO.mp3"
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLSfXvyM4HX_WzeqhNBsVItLE3vxaX-jxfyQcUzlmIYemI6seEA/formResponse",   //done
    message: "https://script.google.com/macros/s/AKfycbyhXfGvSAOcfVjsGTCFSERVHIBT8YSAF6UWufUSZVFIsO-DmRCfP4cu8BGFC9_kGd2Z/exec",  //done
    guestList: "https://script.google.com/macros/s/AKfycbweU0eMuEW3ZNX9BJq0DTNE316uD9aOJXTwi7Jqo-fyRbcJ4oXmC_bl4xn-9yysI50/exec",  //done
    guestRequest: "https://script.google.com/macros/s/AKfycbwGjD_2Bz-m3PRk5Dqz7w6N5iIs0WyrjwTGSt8-ADpbgySvQRPtYMX2ADQ4Rus37Qyl/exec",   //done
    entourage: "https://script.google.com/macros/s/AKfycbyd0hWgNr8CkleXsPlH_qhJpm70QRM2Y86-5536jqfBgh8uR-t3LKVSJWKhlgb45mZM/exec",  //done
    sponsors: "https://script.google.com/macros/s/AKfycbxq-e_jonY_uVE22DLlOoQoRdsN8HjCc47LtavCpRkoXQCjHb0iJa_4bf2KD6wMPucW/exec",  //done 
    proposalResponses: "https://script.google.com/macros/s/AKfycbyd0hWgNr8CkleXsPlH_qhJpm70QRM2Y86-5536jqfBgh8uR-t3LKVSJWKhlgb45mZM/exec", // uses entourage script with action: proposal
    weddingDetails: "https://script.google.com/macros/s/AKfycbwqB5jIWv_-VZbX4jCGK6lEH6lEHqaSqrVcUaBSP-SWNtnPy36VmDl0xT-ocKPrWSNA/exec",   //done
////google share 
    googleShare: "https://docs.google.com/spreadsheets/d/1OXyjq_SnyzPwIT1tRKo4Sjf_00sexatbmFA9DdJ-bR4/edit?usp=sharing", 
  },
  wedding: {
    date: "November 7, 2026",
    time: "2:00 PM",
    venue: "St. Joseph Church",
    tagline: "are getting married!",
    theme: "Our wedding palette is inspired by timeless elegance and warmth.Motif Colors: Champagne Gold, Soft Beige, Warm Soft Brown",
    motif: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
  },
  proposal: {
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Matron of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
  },
  details: {
    rsvp: {
      deadline: "September 30, 2026",
      contact: "Teri Nicole A. Guillermo",
      phone: "+63 956 482 5255",
    },
  },
  contact: {
    bridePhone: "+63 956 482 5255",
    groomPhone: "",
    email: "",
  },
  giftRegistry: {
    QR_1:{
    id: "BPI",
    src: "/monogram/BPI.png",
    label: "BPI",
    accountNumber: "Teri Nicole Guillermo : 3519080248",
    },
    QR_2:{
    id: "Zelle",
    src: "/monogram/Zelle.png",
    label: "Zelle",
    accountNumber: "Patrick James Javar : 914-770-0009",
    }
  },
  ceremony: {
    location: "St. Joseph Church",
    venue: " Sts, Nunez cor, Tomas Claudio St, Zamboanga City",
    map: "https://maps.app.goo.gl/c7jCXMkPfqfU2txe6",
    date: "November 7, 2026",
    day: "Saturday",
    time: "2:00 PM",
    entourageTime: "1:00 PM",
    guestsTime: "1:30 PM",
    image: "/Details/ceremony_1.webp",
  },
  reception: {
    location: "Palacio Del Sur",
    venue: " Marcian Garden Hotel, Governor Camins Avenue, Baliwasan, Zamboanga City",
    map: "https://maps.app.goo.gl/13V2x6vJxYe5q3W16",
    date: "November 7, 2026",
    day: "Saturday",
    time: "5:15 PM",
    image: ["/Details/recepton_1.webp","/Details/reception_2.webp"],
  },
  dressCode: {
      theme: "SEMI-FORMAL",
    colors: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
    sponsors: {
      male: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      female: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "Your Presence will make our day even more special \n Ninong: Formal Wear : Charcoal Gray suid and Slacks, white long sleeves, and burgundy neckite \n Ninang: Long Dress / Formal Dress Burgundy Long Formal Dress.",
      photo: "/Details/principal sponsors (2).png",
      palette: "#C8CBCF, #9DA3AD, #737982, #474D5A, #B2B8C5"
    },
    entourage: {
      gents: "Dusty blue suit with blue necktie",
      ladies: "Dusty blue formal gown",
      notes: "Dressed in the color of unity — dusty blue.",
      photo: "/Details/secondary sponsors (2).png",
      palette: "#A0BFDA, #8AAECC, #7B9EC6, #6B8DB5, #5B7EA4",
    },
    guests: {
      gents: "Dusty blue long sleeve with gray or black slacks",
      ladies: "Dusty blue gown, midi dress, or cocktail dress",
      notes: "We kindly ask our guests to wear the colors shown above.",
      photo: "/Details/guest (6).png",
      palette: "#A0BFDA, #7B9EC6, #6B8DB5, #8EA7C4, #5B7EA4",
    },
    note: "We kindly request our guests to dress in attire following our wedding palette."
  },
  narratives: {
    ourStory: `Once upon a signature…

Our story began with a simple signature, one that slowly turned into something magical. He was my financial advisor, and I was there to sign documents. It was July 5, 2021, and we met at the Lobby of the building. Little did we know, that ordinary day would start a story neither of us expected.

I wasn't looking for anything, yet somehow, our connection grew in its own gentle, unexpected way. And then, on June 1, 2022, our story truly began—we became us. We found a love that feels like home.

Our journey wasn't rushed, but perfectly timed. We believe that God brought us together in His own way and season.

With hearts full of gratitude, we step into this new chapter hand in hand, trusting His plan and celebrating a love rooted in faith, patience, and grace.

Today, we choose each other- again and again- and we can't wait to celebrate this new chapter with the people we love most.`,
    groom: `The first time Mark saw Catherine, time seemed to slow down. It was an ordinary day that instantly became unforgettable: one smile, one hello, and suddenly his world had a new center. He didn't have the perfect words ready, but he knew he had met someone who felt like home.

Early conversations turned into late-night talks, sharing dreams, favorite meals, and whispered prayers for a future together. With every small adventure—coffee runs, long drives, quiet walks—Mark found himself choosing her over and over again. He loved how she laughed freely, how she listened with her whole heart, and how her faith steadied him.

There were seasons of distance and long workdays, but every reunion reminded him why he stayed patient: because Catherine was worth every mile and every minute apart. When he finally knelt to ask for her hand, it wasn't a question of "if," only "when can we start forever?"`,
    bride: `Catherine remembers the first time Mark said her name. It was gentle but sure, a kindness that made her feel both seen and safe. In that softness, she found a partner who met her with the same grace she prayed to give.

Mark's steadiness won her heart: the way he showed up, even when schedules were tight, and how he always found lightness in the small things. He celebrated her wins, held space for her worries, and never hesitated to choose "us" in every decision.

Now, as they prepare to say yes before God and the people they love most, Catherine is grateful for the patience, humor, and hope Mark brings to every day. She knows this next chapter is just the start of the love story they get to write together.`,
  },
  colors: {
    primary: "#87AE73",
    secondary: "#F5F5DC",
  },
  playlist: {
    title: "A Playlist from our hearts",
    subtitle: "Songs that have been part of our journey together",
    playlistName: "PJ & Nicole Wedding",
    embedUrl:
      "https://open.spotify.com/embed/playlist/2FUZHCJs6Z5iBvP0rKvQdu?utm_source=generator",
    spotifyUrl: "https://open.spotify.com/playlist/2FUZHCJs6Z5iBvP0rKvQdu",
  },
  snapShare: {
    googleDriveLink:
      "https://weduploader.com/upload/x2kqPwdYOMbQ5Dto?utm_source=site&utm_medium=qrcode&utm_campaign=dashboard&utm_content=x2kqPwdYOMbQ5Dto",
    albumQR: "/QR/AlbumQR.png",
    hashtag: ["#NicsChapterWithPj"],
    instructions: "Please scan this QR Code and upload the photos and videos you have taken during our wedding reception. We are delighted to see your snaps too!",
  },
}

export const entourage = [
  // Best Man & Maid/Matron of Honor
  { role: "Best Man", name: "Red Casallo" },
  { role: "Matron of Honor", name: "Imeeliza Timpug" },

  // Parents of the Bride
  { role: "Father", name: "Jaime Balajadia (Uncle)", group: "kate-family" },
  { role: "Mother", name: "Eloida Ricohermoso", group: "kate-family" },

  // Parents of the Groom
  { role: "Brother", name: "Perry Ticbaen (Brother)", group: "christian-family" },
  { role: "Mother", name: "Felicitas Ticbaen", group: "christian-family" },

  // Bridesmaids
  { role: "Bridesmaid", name: "Thea Lynn Dela Cruz" },
  { role: "Bridesmaid", name: "Keara Zane A Cariño" },
  { role: "Bridesmaid", name: "Fidnah Gracia Padallan" },
  { role: "Bridesmaid", name: "Lorna Ladisla" },
  { role: "Bridesmaid", name: "Carla Vanessa Tabilin" },
  { role: "Bridesmaid", name: "Romela Tolentino" },
  { role: "Bridesmaid", name: "Emmalyn Lipio" },
  { role: "Bridesmaid", name: "Carmen Pascual" },
  { role: "Bridesmaid", name: "Ciddie Manota" },

  // Groomsmen
  { role: "Groomsman", name: "Noah Alcaria" },
  { role: "Groomsman", name: "Jervin Garcia" },
  { role: "Groomsman", name: "Myric Mateo" },
  { role: "Groomsman", name: "Caughvan Faustino" },
  { role: "Groomsman", name: "Jayson Torquiano" },
  { role: "Groomsman", name: "Jendah Egino" },
  { role: "Groomsman", name: "Vincent Saguinsin" },
  { role: "Groomsman", name: "Frederick Manota" },
  { role: "Groomsman", name: "Emerson Sulit" },

  // Secondary Sponsors
  // Candle Sponsors
  { role: "Bridesmaid", name: "Romela Tolentino", group: "candle" },
  // Cord Sponsors
  { role: "Bridesmaid", name: "Emmalyn Lipio", group: "cord" },

  // Flower Girls and Little Bride
  { role: "Flower Girl", name: "Kirsten Elija Leyson" },
  { role: "Flower Girl", name: "Blake Juan" },
  { role: "Flower Girl", name: "Reign Arastel Rivera" },
  { role: "Little Bride", name: "Paige Yael Ticbaen" },

  // Ring / Coin Bearers
  { role: "Ring Bearer", name: "Khaleb Dwayne M. Beltran" },
  { role: "Coin Bearer", name: "Lucas Rhaiden Beltran" },
  { role: "Ring Bearer", name: "Dean James Ticbaen" },
]

export const principalSponsors = [
  // Paired from provided Male and Female Sponsors (order-based)
  { name: "Mr. Jony Balao", spouse: "Mrs. Conception Balao" },
  { name: "Mr. Cresencio Francisco", spouse: "Dr. Editha Francisco" },
  { name: "Mr. Aurelio Sab-it", spouse: "Mrs. Ester Sab-it" },
  { name: "Mr. Pio McLiing", spouse: "Mrs. Edna Boloma" },
  { name: "Mr. Fabian Dupiano", spouse: "Mrs. Mary Christine Dupiano" },
  { name: "Mr. Roberto Dosdos", spouse: "Mrs. Angelica Dosdos" },
  { name: "Mr. George Sacla", spouse: "Mrs. Minda De Bolt Sacla" },
  { name: "Mr. Elmo Casallo", spouse: "Mrs. Nora Casallo" },
  { name: "Engr. Jimmy Atayoc Sr", spouse: "Mrs. Mercedes Atayoc" },
  { name: "Mr. Tomas Moyongan", spouse: "Mrs. Betty Moyongan" },
  { name: "Mr. Roger Balantin", spouse: "Mrs. Delia Balantin" },
  { name: "Honorable Mayor Roderick Awingan", spouse: "Mrs. ____ Awingan" },
  { name: "Engr Roy Kepes", spouse: "Vice Gove MaryRose Kepes Fongwan" },
  { name: "Mr. Bobos Nestor Fongwan", spouse: "Mrs. Marga Sison" },
  { name: "Mr. Junvic Suguinsin", spouse: "Mrs. Lavenia Inson" },
  { name: "Mr. Salino Dosdos Jr", spouse: "Mrs. Gina Guiang" },
  { name: "Mr. Pampilo Balajadia", spouse: "Mrs. Angelica Balajadia" },
  { name: "Mr. Alan M. Serduar", spouse: "Mrs. Oliva Serduar" },
  { name: "Mr. Miguel Franco", spouse: "Mrs. Angela Balajadia" },
  // Remaining Female Sponsors without paired male
  { name: "Mrs. Carina C. Watanabe", spouse: "" },
  { name: "Mrs. Cecile Palilio", spouse: "" },
  { name: "Mrs. Nida Saguinsin", spouse: "" },
  { name: "Mrs. Araceli Pitogo", spouse: "" },
  { name: "Mrs. Alda Unidad", spouse: "" },
  { name: "Mrs. Reine Bernadeth Bolanos", spouse: "" },
]
