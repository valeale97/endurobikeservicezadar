document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".typing").forEach((element) => {
    const words = element.getAttribute("data-typing")
      ? element.getAttribute("data-typing").split(",").map(w => w.trim()).filter(Boolean)
      : element.textContent.split(",").map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    element.textContent = "";
    element.classList.add("active");
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typingSpeed = 72, deletingSpeed = 40, delayBetweenWords = 1150;
    function typeEffect() {
      const currentWord = words[wordIndex];
      if (!currentWord) return;
      if (!isDeleting) {
        element.textContent = currentWord.substring(0, charIndex + 1);
        charIndex += 1;
        if (charIndex === currentWord.length) setTimeout(() => { isDeleting = true; }, delayBetweenWords);
      } else {
        element.textContent = currentWord.substring(0, Math.max(0, charIndex - 1));
        charIndex -= 1;
        if (charIndex <= 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; charIndex = 0; }
      }
      setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }
    typeEffect();
  });
});

(function(){
  const esc = (s='') => String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  const service = (id, nameEn, nameHr, descEn, descHr, price, tags = []) => ({
    id, title: { en: nameEn, hr: nameHr }, desc: { en: descEn, hr: descHr }, price, tags
  });

  const category = (titleEn, titleHr, descEn, descHr, cover, pathEn, pathHr, items = []) => ({
    title: { en: titleEn, hr: titleHr },
    desc: { en: descEn, hr: descHr },
    cover, path: { en: pathEn, hr: pathHr }, items
  });

  const galleryImage = (src, alt = "Bike Photo", position = "50% 50%", thumb = src) => ({
    type: "image", src, thumb, alt, position
  });

  const siteData = {
  site: {
    brand: "Enduro Bike Service",
    name: "Enduro Bike Service",
    domain: "https://www.enduro-bike-service.com",
    assets: {
      logo: "/assets/img/logo.png",
      socialImage: "/assets/img/logo.png"
    },
    seo: {
      home: {
        path: { en: "/en/", hr: "/hr/" },
        xDefault: "/hr/",
        title: { en: "Enduro Bike Service Zadar", hr: "Enduro Bike Service Zadar" },
        description: { en: "Enduro Bike Service Zadar provides professional bicycle service since 2021: MTB service, e-bike mechanical service, suspension, brakes, wheels, drivetrain and general bicycle service in Zadar.", hr: "Enduro Bike Service Zadar nudi profesionalan servis bicikala od 2021.: MTB servis, mehanički servis e-bike bicikala, servis suspenzija, kočnica, kotača, pogona i generalni servis bicikla u Zadru." }
      },
      legal: {
        privacy: {
          path: { en: "/en/privacy.html", hr: "/hr/privacy.html" },
          xDefault: "/hr/privacy.html",
          title: { en: "Privacy Policy | Enduro Bike Service", hr: "Politika privatnosti | Enduro Bike Service" },
          description: { en: "Privacy policy for Enduro Bike Service.", hr: "Politika privatnosti za Enduro Bike Service." }
        },
        cookies: {
          path: { en: "/en/cookies.html", hr: "/hr/cookies.html" },
          xDefault: "/hr/cookies.html",
          title: { en: "Cookie Policy | Enduro Bike Service", hr: "Pravila o kolačićima | Enduro Bike Service" },
          description: { en: "Cookie policy for Enduro Bike Service.", hr: "Pravila o kolačićima za Enduro Bike Service." }
        },
        success: {
          path: { en: "/en/success/", hr: "/hr/uspjeh/" },
          xDefault: "/hr/uspjeh/",
          title: { en: "Message sent | Enduro Bike Service", hr: "Poruka poslana | Enduro Bike Service" },
          description: { en: "Your message has been sent to Enduro Bike Service.", hr: "Vaša poruka je poslana servisu Enduro Bike Service." }
        }
      }
    },
    heroVideo: { en: "/assets/video/hero.mp4", hr: "/assets/video/hero.mp4" },
    heroPoster: "/assets/img/hero-poster.png"
  },
  home: {
    servicesOrder: ["maintenance", "wheels", "brakes", "steering", "drivetrain", "other"],
    ui: { en: {
      servicesOverlay: "Open",
      categoryAria: "Open service category",
      galleryOverlay: "Open gallery",
      searchPlaceholder: "Search services in English or Croatian…",
      searchEmpty: "No services match your search yet.",
      searchTitle: "Find a service fast",
      searchHint: "Search by service name, symptom, or bike part. Example: brake bleed, kočnice, fork, chain."
    }, hr: {
      servicesOverlay: "Otvori",
      categoryAria: "Otvori kategoriju usluge",
      galleryOverlay: "Otvori galeriju",
      searchPlaceholder: "Pretraži usluge na hrvatskom ili engleskom…",
      searchEmpty: "Nema rezultata za ovu pretragu.",
      searchTitle: "Brza pretraga usluga",
      searchHint: "Pretražujte po nazivu usluge, problemu ili dijelu bicikla. Primjer: brake bleed, kočnice, vilica, lanac."
    } }
  },
  about: {
    title: { en: "", hr: "" },
    body: { en: "Enduro Bike Service started operating in 2021 and has since been providing fast, reliable, and professional service with many satisfied clients. The workshop specializes in maintenance, repairs, and adjustments for MTB, enduro, trail, and e-bike bicycles, while also offering service for regular bikes used for everyday riding, recreation, and city commuting. Services include general bike servicing, wheel work, brakes, cockpit components, drivetrain repairs, suspension servicing, and other workshop tasks. For e-bikes, the service focuses on the mechanical parts of the bicycle, including brakes, wheels, drivetrain, cockpit components, bearings, suspension, and other parts that require regular maintenance or repair. The goal is to make every bike safe, reliable, and ready to ride.", 
      hr: "Enduro Bike Service počeo je s radom 2021. godine te od tada pruža brzu, pouzdanu i profesionalnu uslugu s velikim brojem zadovoljnih klijenata. Servis je specijaliziran za održavanje, popravke i podešavanje MTB, enduro, trail i e-bike bicikala, ali također pruža usluge servisa za klasične bicikle za svakodnevnu vožnju, rekreaciju i gradsku upotrebu. U ponudi su generalni servisi, radovi na kotačima, kočnicama, upravljačkom dijelu, pogonskom dijelu, suspenzijama te ostali radionički poslovi. Kod e-bike bicikala servis se odnosi na mehaničke dijelove bicikla, uključujući kočnice, kotače, prijenos, upravljački dio, ležajeve, suspenzije i ostale komponente koje zahtijevaju redovito održavanje ili popravak. Cilj servisa je da svaki bicikl bude siguran, pouzdan i spreman za vožnju." },
    bullets: { en: [], hr: [] }
  },
  services: {
    maintenance: category(
      "Service", "Servis",
      "Diagnosis, general bicycle service, small service, transport, basic setup and full suspension frame service for MTB, enduro, trail and e-bike riders in Zadar.",
      "Defektaža, generalni i mali servis bicikla, transport, osnovno podešavanje i servis full suspension okvira za MTB, enduro, trail i e-bike korisnike u Zadru.",
      "/assets/img/general_service.png", "/en/services/service/", "/hr/usluge/servis/",
      [
        service('working-hour','Working hour','Radni sat','Hourly workshop labor for diagnostics, adjustments, assembly and custom repairs charged by time.','Radionički rad po satu za dijagnostiku, podešavanja, montažu i posebne popravke koji se naplaćuju po vremenu.','30 €',['labor','repair','diagnostics','radni sat']),
        service('general-service','General service','Generalni servis','Complete bicycle service including drivetrain check, brake and gear adjustment, wheel check and overall safety inspection.','Kompletan servis bicikla koji uključuje pregled pogona, podešavanje kočnica i mjenjača, provjeru kotača i opći sigurnosni pregled.','100 €',['general service','servis','brakes','gears']),
        service('mtb-service','MTB service','Servis MTB','Mountain bike service focused on drivetrain, brakes, gear setup, bolt check and overall trail-readiness.','Servis brdskog bicikla s naglaskom na pogon, kočnice, podešavanje mjenjača, provjeru vijaka i pripremu za vožnju.','60 €',['mtb','servis','brakes','gears']),
        service('small-mtb-service','Small MTB service','Mali servis MTB','Basic MTB service for quick adjustments, brake and gear setup, tire pressure check and essential safety inspection.','Osnovni MTB servis za brza podešavanja, podešavanje kočnica i mjenjača, provjeru tlaka u gumama i osnovni sigurnosni pregled.','40 €',['mtb','small service','adjustment','pregled']),
        service('bike-transport','Bike transport','Transport bicikla','Local bicycle pickup or delivery transport for service, repair or return after completed work.','Lokalni prijevoz bicikla za preuzimanje, servis, popravak ili povrat nakon obavljenog rada.','20 €',['transport','pickup','delivery','prijevoz']),
        service('bike-transport-outside-city','Bike transport outside the city','Transport bicikla izvan grada','Bicycle transport outside the city area, arranged for service pickup, delivery or return.','Prijevoz bicikla izvan grada za preuzimanje, dostavu ili povrat bicikla nakon servisa.','40 €',['transport','outside city','delivery','prijevoz']),
        service('full-suspension-frame-service','Full suspension frame service','Servis full suspension okvira','Inspection and service of full suspension frame linkage, pivots and hardware to restore smooth frame movement.','Pregled i servis full suspension okvira, linkova, pivota i vijaka za ponovno glatko kretanje suspenzija.','100 €',['full suspension','frame','pivots','okvir'])
      ]
    ),
    wheels: category(
      "Wheels", "Kotači",
      "Wheel truing, spokes, hubs, tires, tubes, tubeless setup and wheel rebuilds for reliable MTB and e-bike wheels.",
      "Centriranje kotača, žbice, nabe, gume, zračnice, tubeless setup i preslagivanje kotača za pouzdan rad MTB i e-bike kotača.",
      "/assets/img/wheel.png", "/en/services/wheels/", "/hr/usluge/kotaci/",
      [
        service('spoke-replacement','Spoke replacement','Zamjena žbice','Replacement of a broken or damaged spoke with basic wheel tension check.','Zamjena puknute ili oštećene žbice uz osnovnu provjeru napetosti kotača.','3 €',['spoke','wheel','žbica','kotac']),
        service('wheel-truing','Wheel truing','Centriranje kotača','Wheel straightening and tension adjustment for smoother and safer riding.','Centriranje kotača i podešavanje napetosti žbica za mirniju i sigurniju vožnju.','10 €',['wheel','true','centering','kotac']),
        service('rim-rebuild-with-truing','Rim rebuild with truing','Preslagivanje obruča sa centriranjem','Rebuilding the wheel with a different rim and final truing for proper alignment.','Preslagivanje kotača na drugi obruč uz završno centriranje i podešavanje.','30 €',['rim','rebuild','wheel','obruč']),
        service('wheel-lacing-with-truing','Wheel lacing with truing','Pletenje kotača sa centriranjem','Complete wheel lacing and truing for correct spoke tension and wheel alignment.','Kompletno pletenje kotača uz centriranje i podešavanje napetosti žbica.','35 €',['wheel','lacing','spokes','pletenje']),
        service('front-hub-service','Front hub service','Servis prednje glavčine','Front hub service including cleaning, inspection, lubrication and adjustment.','Servis prednje glavčine koji uključuje čišćenje, pregled, podmazivanje i podešavanje.','15 €',['hub','front','bearing','glavčina']),
        service('rear-cassette-hub-service','Rear cassette hub service','Servis zadnje glavčine kazetne','Rear cassette hub service with cleaning, lubrication, bearing check and adjustment.','Servis zadnje kazetne glavčine uz čišćenje, podmazivanje, provjeru ležajeva i podešavanje.','30 €',['rear hub','cassette','bearing','glavčina']),
        service('rear-freewheel-hub-service','Rear freewheel hub service','Servis zadnje glavčine za kranc','Rear freewheel hub service with cleaning, lubrication and bearing adjustment.','Servis zadnje glavčine za kranc uz čišćenje, podmazivanje i podešavanje ležajeva.','12 €',['rear hub','freewheel','kranc','glavčina']),
        service('cassette-freewheel-replacement','Cassette/freewheel replacement','Zamjena kazete/kranca','Replacement of cassette or freewheel with fitment check and basic drivetrain inspection.','Zamjena kazete ili kranca uz provjeru montaže i osnovni pregled pogona.','10 €',['cassette','freewheel','kranc','kazeta']),
        service('tire-tube-replacement','Tire and/or tube replacement','Zamjena gume i/ili zračnice','Replacement of tire and/or inner tube with correct seating and pressure check.','Zamjena gume i/ili zračnice uz pravilno namještanje i provjeru tlaka.','10 €',['tire','tube','guma','zračnica']),
        service('gazelle-tire-tube-replacement','Gazelle tire/tube replacement','Zamjena gume/zračnice na Gazella bicikli','Tire or tube replacement on Gazelle-style bikes with enclosed or more complex wheel setup.','Zamjena gume ili zračnice na Gazella biciklu sa zatvorenim ili složenijim sklopom kotača.','15 €',['gazelle','tire','tube','guma']),
        service('tubeless-system-setup','Tubeless system setup','Postavljanje tubeless sistema','Tubeless setup with tape, valve and sealant for fewer punctures and better ride performance.','Postavljanje tubeless sistema s trakom, ventilom i tekućinom za manje bušenja i bolju vožnju.','20 €',['tubeless','sealant','valve','guma']),
        service('sealant-refill-100ml','Sealant refill 100 ml','Dodavanje samokrpajuće tekućine (100 ml)','Adding 100 ml of tubeless sealant to refresh puncture protection.','Dodavanje 100 ml samokrpajuće tekućine za obnovu zaštite od bušenja.','10 €',['sealant','tubeless','mlijeko','tekućina']),
        service('major-wheel-truing','Major wheel truing','Centriranje kotača veće zakrivljenosti','Correction of a heavily bent wheel with additional spoke tension balancing.','Centriranje jače zakrivljenog kotača uz dodatno podešavanje napetosti žbica.','15 €',['wheel','truing','bent wheel','centriranje']),
        service('rear-hub-axle-replacement','Rear hub axle replacement','Zamjena osovine stražnje nabe','Replacement of rear hub axle with bearing and cone adjustment.','Zamjena osovine stražnje nabe uz podešavanje ležajeva i konusa.','15 €',['rear hub','axle','naba','osovina']),
        service('front-hub-axle-replacement','Front hub axle replacement','Zamjena osovine prednje nabe','Replacement of front hub axle with bearing and cone adjustment.','Zamjena osovine prednje nabe uz podešavanje ležajeva i konusa.','11 €',['front hub','axle','naba','osovina']),
        service('wheel-disassembly','Wheel disassembly','Rastavljanje kotača','Disassembly of wheel components for repair, rebuild or part replacement.','Rastavljanje dijelova kotača za popravak, preslagivanje ili zamjenu dijelova.','10 €',['wheel','disassembly','rastavljanje','kotac']),
        service('tubeless-wheel-spoke-replacement','Tubeless wheel spoke replacement','Zamjena žbice tubeless kotača','Spoke replacement on a tubeless wheel with care for tape and sealing system.','Zamjena žbice na tubeless kotaču uz pažnju na traku i brtvljenje sistema.','14 €',['spoke','tubeless','wheel','žbica']),
        service('cone-adjustment','Cone adjustment','Podešavanje konusa','Adjustment of hub cones to remove play and restore smooth wheel rotation.','Podešavanje konusa glavčine za uklanjanje lufta i glatko okretanje kotača.','6 €',['cone','hub','bearing','konus']),
        service('hub-bearing-replacement','Front/rear hub bearing replacement','Zamjena ležajeva prednje/stražnje nabe','Replacement of front or rear hub bearings for smoother and safer wheel rotation.','Zamjena ležajeva prednje ili stražnje nabe za glatko i sigurno okretanje kotača.','15 €',['bearing','hub','ležaj','naba']),
        service('freewheel-ratchet-service','Freewheel ratchet service','Servis čegrtaljke','Service of the freewheel ratchet mechanism with cleaning, inspection and lubrication.','Servis čegrtaljke uz čišćenje, pregled i podmazivanje mehanizma.','14 €',['freewheel','ratchet','čegrtaljka','servis']),
        service('tubeless-tire-rim-cleaning','Tubeless tire and rim cleaning','Čišćenje tubeless gume i obruča','Cleaning old sealant residue from tubeless tire and rim before refitting.','Čišćenje ostataka stare tubeless tekućine s gume i obruča prije ponovne montaže.','10 €',['tubeless','cleaning','rim','obruč']),
        service('inner-tube-patching','Inner tube patching','Krpanje zračnice','Repair of a punctured inner tube with patch and leak check.','Krpanje probušene zračnice uz provjeru curenja zraka.','3 €',['tube','patch','puncture','zračnica'])
      ]
    ),
    brakes: category(
      "Brakes", "Kočnice",
      "Hydraulic and mechanical brake adjustment, bleeding, pads, rotors, hoses and caliper service for safe braking.",
      "Podešavanje hidrauličnih i mehaničkih kočnica, odzračivanje, pakne, diskovi, crijeva i servis čeljusti za sigurno kočenje.",
      "/assets/img/brakes.png", "/en/services/brakes/", "/hr/usluge/kocnice/",
      [
        service('brake-pad-replacement-adjustment','Brake pad replacement with adjustment','Zamjena pakni kočnice s podešavanjem','Replacement of brake pads with brake alignment and setup for proper stopping power.','Zamjena pakni kočnice uz podešavanje položaja i rada kočnice za sigurno kočenje.','10 €',['brake','pads','adjustment','pakne']),
        service('v-brake-caliper-installation','V-brake caliper installation','Ugradnja čeljusti kočnice V-brake','Installation of V-brake caliper with basic alignment and function check.','Ugradnja V-brake čeljusti uz osnovno poravnanje i provjeru rada.','10 €',['v-brake','caliper','brake','čeljust']),
        service('brake-lever-installation','Brake lever installation','Ugradnja ručice kočnice','Installation of a brake lever with cable connection and basic brake setup.','Ugradnja ručice kočnice uz spajanje sajle i osnovno podešavanje kočnice.','10 €',['brake','lever','ručica','kočnica']),
        service('brake-adjustment','Brake adjustment','Podešavanje kočnice','Brake adjustment for better lever feel, pad position and stopping performance.','Podešavanje kočnice za bolji osjećaj na ručici, položaj pakni i učinkovitije kočenje.','10 €',['brake','adjustment','setup','kočnica']),
        service('brake-cable-replacement','Brake cable replacement','Promjena sajle kočnice','Replacement of brake cable with basic tension and function adjustment.','Zamjena sajle kočnice uz osnovno podešavanje napetosti i provjeru rada.','5 €',['brake','cable','sajla','kočnica']),
        service('rotor-installation','Rotor installation','Ugradnja diska','Installation of brake rotor with fitment and alignment check.','Ugradnja kočionog diska uz provjeru montaže i poravnanja.','5 €',['rotor','disc','brake','disk']),
        service('disc-brake-installation-per-wheel','Disc brake installation per wheel','Ugradnja disk kočnice po kotaču','Installation of disc brake on one wheel with alignment and function check.','Ugradnja disk kočnice po kotaču uz poravnanje i provjeru rada.','15 €',['disc brake','installation','wheel','disk kočnica']),
        service('hydraulic-brake-bleed-oil','Hydraulic brake bleed with oil','Odzračivanje hidraulične kočnice/ulje','Hydraulic brake bleeding with oil replacement or refill for firmer braking feel.','Odzračivanje hidraulične kočnice uz zamjenu ili dopunu ulja za čvršći osjećaj kočenja.','15 €',['hydraulic','brake bleed','oil','ulje']),
        service('brake-cleaning','Brake cleaning','Čišćenje kočnice','Cleaning of brake parts to remove dirt and improve braking consistency.','Čišćenje dijelova kočnice radi uklanjanja prljavštine i boljeg rada kočnice.','5 €',['brake','cleaning','čišćenje','kočnica']),
        service('brake-piston-cleaning-lubrication','Brake piston cleaning and lubrication','Čišćenje i podmazivanje klipova','Cleaning and lubrication of brake pistons to restore smooth caliper movement.','Čišćenje i podmazivanje klipova kočnice za glatko kretanje čeljusti.','10 €',['pistons','caliper','lubrication','klipovi']),
        service('disc-brake-housing-installation','Disc brake housing installation','Ugradnja bužira disk kočnice','Installation of disc brake housing with routing and basic brake function check.','Ugradnja bužira disk kočnice uz provlačenje i osnovnu provjeru rada.','14 €',['housing','brake','bužir','disk kočnica']),
        service('four-piston-caliper-cleaning-lubrication','4-piston caliper cleaning and lubrication','Čišćenje i podmazivanje 4-klipne čeljusti','Cleaning and lubrication of a 4-piston brake caliper for smoother piston movement.','Čišćenje i podmazivanje 4-klipne kočione čeljusti za glatkiji rad klipova.','15 €',['4-piston','caliper','cleaning','čeljust']),
        service('rotor-straightening','Rotor straightening','Ravnanje diska','Straightening of a bent brake rotor to reduce rubbing and vibration.','Ravnanje iskrivljenog kočionog diska radi smanjenja struganja i vibracija.','4 €',['rotor','straightening','disc','ravnanje']),
        service('hydraulic-brake-lever-installation','Hydraulic brake lever installation','Ugradnja ručice hidraulične kočnice','Installation of hydraulic brake lever with connection and basic function check.','Ugradnja ručice hidraulične kočnice uz spajanje i osnovnu provjeru rada.','15 €',['hydraulic','brake lever','ručica','kočnica']),
        service('hydraulic-brake-bleed','Hydraulic brake bleed','Odzračivanje hidraulične kočnice','Bleeding of hydraulic brake system to remove air and restore braking performance.','Odzračivanje hidrauličnog kočionog sustava za uklanjanje zraka i bolji rad kočnice.','10 €',['hydraulic','brake bleed','kočnica','odzračivanje']),
        service('rotor-washing-degreasing','Rotor washing and degreasing','Pranje i odmašćivanje rotora','Washing and degreasing of brake rotor to reduce contamination and improve braking.','Pranje i odmašćivanje rotora radi uklanjanja nečistoća i boljeg kočenja.','10 €',['rotor','degreasing','cleaning','rotor'])
      ]
    ),
    steering: category(
      "Steering", "Upravljački dio",
      "Headset, stem, handlebar, grips, steerer tube and cockpit service for precise, safe and comfortable bike control.",
      "Servis headseta, lule, volana, gripova, steerera i kokpita za precizno, sigurno i udobno upravljanje biciklom.",
      "/assets/img/steering.png", "/en/services/steering/", "/hr/usluge/upravljac/",
      [
        service('fork-service-oil-cleaning','Fork service oil change/cleaning','Servis vilice (izmjena ulja/čišćenje)','Fork service with oil change and cleaning to improve smoothness and suspension performance.','Servis vilice uz izmjenu ulja i čišćenje za bolji rad i osjetljivost suspenzija.','50 €',['fork','service','oil','vilica']),
        service('fork-cleaning-lubrication','Fork cleaning and lubrication','Čišćenje i podmazivanje vilice','Cleaning and lubrication of the fork to reduce friction and improve movement.','Čišćenje i podmazivanje vilice radi smanjenja trenja i boljeg rada.','20 €',['fork','cleaning','lubrication','vilica']),
        service('fork-steerer-cutting','Fork steerer cutting','Skraćivanje vrata vilice','Cutting the fork steerer tube to the correct length for proper fitment.','Skraćivanje vrata vilice na odgovarajuću dužinu za pravilnu montažu.','10 €',['fork','steerer','cutting','vilica']),
        service('fork-replacement-bearing-service','Fork replacement with bearing service','Promjena vilice s uređenjem ležaja','Fork replacement with headset bearing check, cleaning and proper setup.','Promjena vilice uz pregled, čišćenje i pravilno podešavanje ležaja.','25 €',['fork','replacement','bearing','vilica']),
        service('fork-bearing-service','Fork bearing service','Servis ležaja vilice','Service of fork/headset bearings for smoother steering and reduced play.','Servis ležaja vilice/headseta za lakše okretanje i uklanjanje lufta.','10 €',['bearing','headset','fork','ležaj']),
        service('grip-replacement','Grip replacement','Zamjena gripova','Replacement of handlebar grips for better comfort and control.','Zamjena gripova upravljača za bolju udobnost i kontrolu.','5 €',['grips','handlebar','replacement','gripovi']),
        service('stem-replacement','Stem replacement','Zamjena lule upravljača','Replacement of the stem with alignment and bolt safety check.','Zamjena lule upravljača uz poravnanje i sigurnosnu provjeru vijaka.','10 €',['stem','handlebar','lula','upravljač']),
        service('handlebar-replacement','Handlebar replacement','Zamjena upravljača','Replacement of handlebar with correct positioning and control alignment.','Zamjena upravljača uz pravilno pozicioniranje i poravnanje komandi.','10 €',['handlebar','replacement','upravljač','volan']),
        service('headset-install-replacement','Headset installation/replacement','Ugradnja-zamjena headseta','Installation or replacement of headset parts for smooth and stable steering.','Ugradnja ili zamjena headseta za glatko i stabilno upravljanje.','20 €',['headset','bearing','steering','ležaj']),
        service('fork-shock-adjustment','Fork/shock adjustment','Podešavanje vilice-amortizera','Basic adjustment of fork or shock settings for rider weight and riding style.','Osnovno podešavanje vilice ili amortizera prema težini vozača i stilu vožnje.','10 €',['fork','shock','adjustment','amortizer']),
        service('open-bath-fork-service','Open bath fork service','Servis vilice s open bath sistemom','Service of open bath fork system with cleaning, lubrication and oil refresh.','Servis vilice s open bath sistemom uz čišćenje, podmazivanje i obnovu ulja.','70 €',['fork','open bath','service','vilica']),
        service('fork-brake-removal-installation','Fork and brake removal/installation','Skidanje/stavljanje vilice i kočnice','Removal or installation of fork and brake components during repair or replacement.','Skidanje ili montaža vilice i kočnice tijekom popravka ili zamjene.','10 €',['fork','brake','installation','vilica']),
        service('headset-star-nut-replacement','Headset star nut replacement','Zamjena zvjezdice headseta','Replacement of headset star nut for secure preload adjustment.','Zamjena zvjezdice headseta za sigurno podešavanje prednaprezanja.','8 €',['headset','star nut','replacement','zvjezdica']),
        service('seal-replacement','Seal replacement','Izmjena brtvi','Replacement of seals to reduce leaks and restore proper component function.','Izmjena brtvi radi smanjenja curenja i vraćanja pravilnog rada komponente.','10 €',['seals','replacement','brtve','service']),
        service('fork-steerer-replacement','Fork steerer replacement','Izmjena steerera vilice','Replacement or service work on the fork steerer for proper fork fitment.','Izmjena ili rad na steereru vilice za pravilnu montažu vilice.','14 €',['fork','steerer','replacement','vilica']),
        service('handlebar-cutting','Handlebar cutting','Skraćivanje volana','Cutting the handlebar to the desired width for comfort and control.','Skraćivanje volana na željenu širinu za bolju udobnost i kontrolu.','8 €',['handlebar','cutting','volan','upravljač']),
        service('bar-tape-installation','Bar tape installation','Ugradnja trake volana','Installation of handlebar tape for comfort, grip and clean finish.','Ugradnja trake volana za udobnost, bolji grip i uredan završetak.','10 €',['bar tape','handlebar','traka','volan']),
        service('crown-race-installation','Crown race installation','Ugradnja crown racea','Installation of crown race on fork for correct headset bearing fitment.','Ugradnja crown racea na vilicu za pravilno sjedanje ležaja headseta.','6 €',['crown race','fork','headset','ležaj'])
      ]
    ),
    drivetrain: category(
      "Drivetrain", "Pogonski dio",
      "Chain, cassette, crankset, derailleurs, cables, housings, Di2 support and drivetrain cleaning for smooth shifting.",
      "Lanac, kazeta, pogon, mjenjači, sajle, bužiri, Di2 podrška i čišćenje pogonskog dijela za glatko mijenjanje brzina.",
      "/assets/img/drivetrain.png", "/en/services/drivetrain/", "/hr/usluge/pogonski-dio/",
      [
        service('bottom-bracket-installation','Bottom bracket installation','Ugradnja pogonskog ležaja','Installation of bottom bracket with fitment check and smooth rotation test.','Ugradnja pogonskog ležaja uz provjeru montaže i glatkog okretanja.','25 €',['bottom bracket','drivetrain','ležaj','pogon']),
        service('chain-installation','Chain installation','Ugradnja lanca','Installation of a new chain with correct length and basic drivetrain check.','Ugradnja novog lanca uz pravilno skraćivanje i osnovnu provjeru pogona.','10 €',['chain','installation','lanac','pogon']),
        service('crankset-installation','Crankset installation','Ugradnja pogona','Installation of crankset with tightening, alignment and function check.','Ugradnja pogona uz zatezanje, poravnanje i provjeru rada.','10 €',['crankset','drivetrain','pogon','kurble']),
        service('derailleur-installation-with-gear-adjustment','Derailleur installation with gear adjustment','Ugradnja mjenjača s podešavanjem brzina','Installation of derailleur with gear indexing and shifting adjustment.','Ugradnja mjenjača uz indeksiranje i podešavanje brzina.','20 €',['derailleur','gears','mjenjač','brzine']),
        service('shifter-installation','Shifter installation','Ugradnja ručice mjenjača','Installation of shifter with cable connection and basic shifting setup.','Ugradnja ručice mjenjača uz spajanje sajle i osnovno podešavanje brzina.','10 €',['shifter','gears','ručica','mjenjač']),
        service('shift-cable-replacement','Shift cable replacement','Promjena sajle mjenjača','Replacement of shift cable with tension adjustment and function check.','Zamjena sajle mjenjača uz podešavanje napetosti i provjeru rada.','5 €',['shift cable','gears','sajla','mjenjač']),
        service('gear-adjustment','Gear adjustment','Podešavanje brzina','Gear adjustment for smoother and more accurate shifting.','Podešavanje brzina za glađe i preciznije mijenjanje prijenosa.','15 €',['gears','adjustment','brzine','mjenjač']),
        service('chain-joining-shortening','Chain joining/shortening','Spajanje/skraćivanje lanca','Joining or shortening the chain to the correct length.','Spajanje ili skraćivanje lanca na pravilnu dužinu.','5 €',['chain','shortening','lanac','spajanje']),
        service('drivetrain-cleaning-lubrication','Drivetrain cleaning and lubrication','Čišćenje pogonskog dijela + podmazivanje','Cleaning and lubrication of drivetrain parts for smoother and quieter operation.','Čišćenje i podmazivanje pogonskog dijela za tiši i glađi rad.','20 €',['drivetrain','cleaning','pogon','podmazivanje']),
        service('internal-housing-routing','Internal housing routing through frame','Provlačenje bužira kroz okvir','Routing cable housing through the frame for internal cable setups.','Provlačenje bužira kroz okvir kod unutarnjeg vođenja sajli.','10 €',['housing','internal routing','bužir','okvir']),
        service('bike-wash-drivetrain-cleaning','Bike wash and drivetrain cleaning','Pranje bicikle, čišćenje pogonskog dijela','Bike washing with drivetrain cleaning to remove dirt, grease and buildup.','Pranje bicikla uz čišćenje pogonskog dijela od prljavštine i masnoće.','28 €',['bike wash','drivetrain','pranje','pogon']),
        service('derailleur-pulley-cleaning-lubrication','Derailleur pulley cleaning and lubrication','Čišćenje i podmazivanje kotačića mjenjača','Cleaning and lubrication of derailleur pulleys for smoother chain movement.','Čišćenje i podmazivanje kotačića mjenjača za glađe kretanje lanca.','7 €',['pulley','derailleur','kotačići','mjenjač']),
        service('dropout-straightening','Dropout straightening','Ravnanje dropouta','Straightening of derailleur dropout for better shifting alignment.','Ravnanje dropouta radi boljeg poravnanja mjenjača i preciznijeg šaltanja.','8 €',['dropout','alignment','ravnanje','mjenjač']),
        service('pedal-installation','Pedal installation','Ugradnja pedala','Installation of pedals with correct threading and tightening.','Ugradnja pedala uz pravilno uvrtanje i zatezanje.','4 €',['pedals','installation','pedale','pogon']),
        service('chainring-installation','Chainring installation','Ugradnja lančanika pogona','Installation of chainring with bolt check and drivetrain fitment.','Ugradnja lančanika pogona uz provjeru vijaka i usklađenosti pogona.','15 €',['chainring','crankset','lančanik','pogon']),
        service('shifter-service','Shifter service','Servis ručice mjenjača','Service of shifter mechanism to improve shifting feel and reliability.','Servis ručice mjenjača za bolji osjećaj šaltanja i pouzdaniji rad.','10 €',['shifter','service','ručica','mjenjač']),
        service('nexus-hub-gear-adjustment','Nexus hub gear adjustment','Podešavanje brzina Nexus nabe','Adjustment of Shimano Nexus hub gears for accurate internal shifting.','Podešavanje brzina Shimano Nexus nabe za precizno unutarnje mijenjanje prijenosa.','12 €',['nexus','hub gears','naba','brzine']),
        service('pedal-service','Pedal service','Servis pedala','Pedal service with cleaning, lubrication and bearing play check.','Servis pedala uz čišćenje, podmazivanje i provjeru lufta ležajeva.','20 €',['pedals','service','pedale','ležaj']),
        service('clutch-mechanism-service','Clutch mechanism service','Servis clutch mehanizma','Service of derailleur clutch mechanism for improved chain stability.','Servis clutch mehanizma mjenjača za bolju stabilnost lanca.','15 €',['clutch','derailleur','mjenjač','lanac']),
        service('crank-thread-repair','Crank thread repair','Obnavljanje navoja kurble pogona','Repair or renewal of crank thread for proper pedal fitment.','Obnavljanje navoja kurble pogona za pravilnu montažu pedale.','10 €',['crank','thread','navoj','kurble']),
        service('di2-diagnostics','Di2 diagnostics','Dijagnostika Di2','Diagnostics of Shimano Di2 electronic shifting system and basic error check.','Dijagnostika Shimano Di2 elektroničkog mjenjača i osnovna provjera grešaka.','30 €',['di2','electronic shifting','diagnostics','mjenjač'])
      ]
    ),
    other: category(
      "Other", "Ostalo",
      "Additional workshop work, suspension service, fork and shock service, dropper posts, bearings, accessories, washing, diagnostics and small repairs.",
      "Dodatni radionički poslovi, servis suspenzija, servis vilice i amortizera, dropper cijevi, ležajevi, oprema, pranje, defektaža i manji popravci.",
      "/assets/img/other.png", "/en/services/other/", "/hr/usluge/ostalo/",
      [
        service('diagnostics','Diagnostics','Defektaža','Inspection and diagnosis of bike issues before repair or service work.','Pregled i dijagnostika problema na biciklu prije popravka ili servisa.','10 €',['diagnostics','inspection','defektaža','pregled']),
        service('kickstand-installation','Kickstand installation','Ugradnja nožice','Installation of a bike kickstand with secure fitment and position check.','Ugradnja nožice za bicikl uz provjeru čvrstoće i položaja.','5 €',['kickstand','installation','nožica','bike']),
        service('mudguard-installation','Mudguard installation','Montaža blatobrana','Installation of mudguards with alignment and clearance check.','Montaža blatobrana uz poravnanje i provjeru razmaka od kotača.','10 €',['mudguard','fender','blatobran','installation']),
        service('bike-wash-lubrication','Bike wash and lubrication','Pranje bicikla + podmazivanje','Bike wash with basic lubrication of moving parts for smoother operation.','Pranje bicikla uz osnovno podmazivanje pokretnih dijelova za bolji rad.','10 €',['bike wash','lubrication','pranje','podmazivanje']),
        service('urgent-service-surcharge','Urgent service surcharge 24h','Nadoplata za hitni servis bicikla 24h','Surcharge for priority bike service completed within 24 hours when possible.','Nadoplata za prioritetni servis bicikla unutar 24 sata kada je izvedivo.','30 €',['urgent','24h','service','hitni servis']),
        service('bike-storage-after-service','Bike storage after service per day','Skladištenje bicikla po danu nakon servisa','Daily storage fee for bikes left after completed service.','Dnevna naknada za skladištenje bicikla nakon završenog servisa.','2 €',['storage','bike','skladištenje','servis']),
        service('bike-safety-check','Bike safety check','Sigurnosni pregled bicikla','Basic safety inspection of brakes, wheels, bolts and overall ride readiness.','Osnovni sigurnosni pregled kočnica, kotača, vijaka i spremnosti bicikla za vožnju.','8 €',['safety','inspection','pregled','bicikl']),
        service('new-bike-assembly-adjustment','New bike assembly with adjustment','Sastavljanje novog bicikla sa podešavanjem','Assembly of a new bike with brake, gear and bolt adjustment.','Sastavljanje novog bicikla uz podešavanje kočnica, brzina i provjeru vijaka.','60 €',['assembly','new bike','sastavljanje','podešavanje']),
        service('rear-air-shock-service','Rear air shock service','Servis stražnjeg zračnog amortizera','Service of rear air shock with cleaning, lubrication and function check.','Servis stražnjeg zračnog amortizera uz čišćenje, podmazivanje i provjeru rada.','40 €',['shock','air shock','amortizer','service']),
        service('shock-bushing-replacement','Shock bushing replacement','Zamjena bushinga amortizera','Replacement of rear shock bushings to reduce play and improve suspension movement.','Zamjena bushinga amortizera za smanjenje lufta i bolji rad suspenzija.','20 €',['shock','bushing','amortizer','replacement']),
        service('rear-shock-replacement','Rear shock replacement','Zamjena stražnjeg amortizera','Replacement of rear shock with fitment and mounting hardware check.','Zamjena stražnjeg amortizera uz provjeru montaže i prihvata.','10 €',['rear shock','replacement','amortizer','suspenzije']),
        service('seal-replacement','Seal replacement','Izmjena brtvi','Replacement of seals to reduce leaks and restore proper component function.','Izmjena brtvi radi smanjenja curenja i vraćanja pravilnog rada komponente.','10 €',['seals','replacement','brtve','service']),
        service('rear-coil-shock-service','Rear coil shock service','Servis stražnjeg coil amortizera','Service of rear coil shock with inspection, cleaning and lubrication.','Servis stražnjeg coil amortizera uz pregled, čišćenje i podmazivanje.','60 €',['coil shock','rear shock','amortizer','service']),
        service('dropper-seatpost-installation','Dropper seatpost installation','Ugradnja dropper cijevi sjedala','Installation of dropper seatpost with routing, setup and function check.','Ugradnja dropper cijevi sjedala uz provlačenje, podešavanje i provjeru rada.','15 €',['dropper','seatpost','installation','sjedalo']),
        service('dropper-cleaning-lubrication','Dropper cleaning and lubrication','Čišćenje i podmazivanje dropera','Cleaning and lubrication of dropper post for smoother movement.','Čišćenje i podmazivanje dropera za glađe podizanje i spuštanje.','10 €',['dropper','cleaning','lubrication','podmazivanje']),
        service('air-shock-damper-service','Air shock damper service','Servis dampera zračnog amortizera','Damper service for rear air shock to improve control and suspension performance.','Servis dampera zračnog amortizera za bolju kontrolu i rad suspenzija.','60 €',['damper','air shock','amortizer','service']),
        service('dropper-bleed','Dropper bleed','Odzračivanje dropera','Bleeding of hydraulic dropper system to restore proper lever feel and movement.','Odzračivanje hidrauličnog dropera za bolji osjećaj na ručici i pravilan rad.','14 €',['dropper','bleed','hydraulic','odzračivanje']),
        service('saddle-installation','Saddle installation','Ugradnja sjedala','Installation of saddle with position and tightening check.','Ugradnja sjedala uz podešavanje položaja i provjeru zatezanja.','5 €',['saddle','seat','sjedalo','installation']),
        service('rear-shock-cleaning','Rear shock cleaning','Čišćenje stražnjeg amortizera','Cleaning of rear shock exterior and moving contact areas.','Čišćenje vanjskog dijela stražnjeg amortizera i pokretnih kontaktnih površina.','14 €',['shock','cleaning','amortizer','čišćenje']),
        service('bearing-press-removal','Bearing removal/pressing','Izbijanje/uprešavanje ležaja','Removal or pressing of bearings during frame or component service.','Izbijanje ili uprešavanje ležaja tijekom servisa okvira ili komponente.','5 €',['bearing','press','ležaj','service']),
        service('bearing-cleaning-lubrication','Bearing cleaning and lubrication','Čišćenje i podmazivanje ležaja','Cleaning and lubrication of bearing to improve smooth rotation and reduce wear.','Čišćenje i podmazivanje ležaja za glatko okretanje i manje trošenje.','5 €',['bearing','cleaning','lubrication','ležaj']),
        service('light-installation','Light installation','Ugradnja svijetla','Installation of bike light with mounting and position check.','Ugradnja svjetla na bicikl uz provjeru montaže i položaja.','3 €',['light','installation','svjetlo','bike']),
        service('damaged-bolt-removal','Damaged bolt removal','Uklanjanje oštećenog vijka','Removal of damaged or rounded bolt from bike components.','Uklanjanje oštećenog ili zaobljenog vijka s dijelova bicikla.','7 €',['bolt','removal','vijak','repair']),
        service('consumable-material','Consumable material','Potrošni materijal','Small consumable workshop material used during repair or service.','Sitni potrošni radionički materijal korišten tijekom popravka ili servisa.','1 €',['material','consumables','potrošni materijal','service']),
        service('chain-guard-installation','Chain guard installation','Montaža štitnika lanca','Installation of chain guard with fitment and clearance check.','Montaža štitnika lanca uz provjeru položaja i razmaka.','4 €',['chain guard','installation','štitnik lanca','lanac']),
        service('basic-nexus-hub-service','Basic Nexus hub service','Osnovni servis Nexus nabe','Basic service of Shimano Nexus hub with adjustment and function check.','Osnovni servis Shimano Nexus nabe uz podešavanje i provjeru rada.','30 €',['nexus','hub','naba','service']),
        service('basket-installation','Basket installation','Ugradnja košare','Installation of bike basket with secure mounting and stability check.','Ugradnja košare na bicikl uz sigurnu montažu i provjeru stabilnosti.','5 €',['basket','installation','košara','bike'])
      ]
    )
  },
  // EDIT GALLERY LIST HERE: add, remove, duplicate, or reorder galleryImage lines.
  // Put image files in /assets/img/ and use /assets/img/file-name.jpg below.
  // Third value controls crop: "50% 50%" = center, "50% 30%" = higher, "left center" = left side.
  gallery: {
    title: { en: "", hr: "" },
    desc: { en: "Take a look through the gallery of real service work, repairs, and completed MTB and e-bike projects. Here you can see examples of work on wheels, brakes, drivetrains, cockpit components, suspension systems, and other service tasks that help bring each bike back to a safe, reliable, and ready-to-ride condition. Each photo shows a part of the everyday workshop process - from detailed diagnostics and precise adjustments to final checks before the bike is returned to the rider. For more updates, new photos, repair examples, and current service work, follow Enduro Bike Service on", 
            hr: "Pogledajte galeriju stvarnih servisnih radova, popravaka i završenih MTB i e-bike bicikala. U galeriji možete vidjeti primjere rada na kotačima, kočnicama, pogonskom dijelu, upravljačkom dijelu, suspenzijama te drugim servisnim zahvatima koji bicikl vraćaju u sigurno i pouzdano stanje. Svaka fotografija prikazuje dio svakodnevnog rada u servisu - od detaljne dijagnostike i podešavanja do završnih provjera prije preuzimanja bicikla. Za još više objava, novih fotografija, primjera popravaka i aktualnih servisnih radova zapratite Enduro Bike Service na" },
    instagramUrl: "https://www.instagram.com/enduro_bike_service/",
    instagramText: { en: "Instagram", hr: "Instagramu" },
    path: { en: "/en/gallery/", hr: "/hr/galerija/" },
    items: [
      galleryImage("/assets/img/bike1.jpg", "Enduro Bike Service gallery photo 1", "50% 50%"),
      galleryImage("/assets/img/bike2.jpg", "Enduro Bike Service gallery photo 2", "50% 50%"),
      galleryImage("/assets/img/bike3.jpg", "Enduro Bike Service gallery photo 3", "50% 50%"),
      galleryImage("/assets/img/bike4.jpg", "Enduro Bike Service gallery photo 4", "50% 50%"),
      galleryImage("/assets/img/bike5.jpg", "Enduro Bike Service gallery photo 5", "50% 50%"),
      galleryImage("/assets/img/bike6.jpg", "Enduro Bike Service gallery photo 6", "50% 50%"),
      galleryImage("/assets/img/bike7.jpg", "Enduro Bike Service gallery photo 7", "50% 50%"),
      galleryImage("/assets/img/bike8.jpg", "Enduro Bike Service gallery photo 8", "50% 50%"),
      galleryImage("/assets/img/bike9.jpg", "Enduro Bike Service gallery photo 9", "50% 50%"),
      galleryImage("/assets/img/bike10.jpg", "Enduro Bike Service gallery photo 10", "50% 50%"),
      galleryImage("/assets/img/bike11.jpg", "Enduro Bike Service gallery photo 11", "50% 50%"),
      galleryImage("/assets/img/bike12.jpg", "Enduro Bike Service gallery photo 12", "50% 50%"),
      galleryImage("/assets/img/bike13.jpg", "Enduro Bike Service gallery photo 13", "50% 50%"),
      galleryImage("/assets/img/bike14.jpg", "Enduro Bike Service gallery photo 14", "50% 50%"),
      galleryImage("/assets/img/bike15.jpg", "Enduro Bike Service gallery photo 15", "50% 50%"),
      galleryImage("/assets/img/bike16.jpg", "Enduro Bike Service gallery photo 16", "50% 50%"),
      galleryImage("/assets/img/bike17.jpg", "Enduro Bike Service gallery photo 17", "50% 50%"),
      galleryImage("/assets/img/bike18.jpg", "Enduro Bike Service gallery photo 18", "50% 50%"),
      galleryImage("/assets/img/bike19.jpg", "Enduro Bike Service gallery photo 19", "50% 50%"),
      galleryImage("/assets/img/bike20.jpg", "Enduro Bike Service gallery photo 20", "50% 50%"),
      galleryImage("/assets/img/bike21.jpg", "Enduro Bike Service gallery photo 21", "50% 50%"),
      galleryImage("/assets/img/bike22.jpg", "Enduro Bike Service gallery photo 22", "50% 50%"),
      galleryImage("/assets/img/bike23.jpg", "Enduro Bike Service gallery photo 23", "50% 50%"),
      galleryImage("/assets/img/bike24.jpg", "Enduro Bike Service gallery photo 24", "50% 50%"),
      galleryImage("/assets/img/bike25.jpg", "Enduro Bike Service gallery photo 25", "50% 50%"),
      galleryImage("/assets/img/bike26.jpg", "Enduro Bike Service gallery photo 26", "50% 50%"),
      galleryImage("/assets/img/bike27.jpg", "Enduro Bike Service gallery photo 27", "50% 50%"),
      galleryImage("/assets/img/bike28.jpg", "Enduro Bike Service gallery photo 28", "50% 50%"),
      galleryImage("/assets/img/bike29.jpg", "Enduro Bike Service gallery photo 29", "50% 50%"),
      galleryImage("/assets/img/bike30.jpg", "Enduro Bike Service gallery photo 30", "50% 50%"),
      galleryImage("/assets/img/bike31.jpg", "Enduro Bike Service gallery photo 31", "50% 50%"),
      galleryImage("/assets/img/bike32.jpg", "Enduro Bike Service gallery photo 32", "50% 50%"),
      galleryImage("/assets/img/bike33.jpg", "Enduro Bike Service gallery photo 33", "50% 50%"),
      galleryImage("/assets/img/bike34.jpg", "Enduro Bike Service gallery photo 34", "50% 50%"),
      galleryImage("/assets/img/bike35.jpg", "Enduro Bike Service gallery photo 35", "50% 50%"),
      galleryImage("/assets/img/bike36.jpg", "Enduro Bike Service gallery photo 36", "50% 50%"),
      galleryImage("/assets/img/bike37.jpg", "Enduro Bike Service gallery photo 37", "50% 50%"),
      galleryImage("/assets/img/bike38.jpg", "Enduro Bike Service gallery photo 38", "50% 50%"),
      galleryImage("/assets/img/bike39.jpg", "Enduro Bike Service gallery photo 39", "50% 50%"),
      galleryImage("/assets/img/bike40.jpg", "Enduro Bike Service gallery photo 40", "50% 50%"),
      galleryImage("/assets/img/bike41.jpg", "Enduro Bike Service gallery photo 41", "50% 50%"),
      galleryImage("/assets/img/bike42.jpg", "Enduro Bike Service gallery photo 42", "50% 50%"),
      galleryImage("/assets/img/bike43.jpg", "Enduro Bike Service gallery photo 43", "50% 50%"),
      galleryImage("/assets/img/bike44.jpg", "Enduro Bike Service gallery photo 44", "50% 50%"),
      galleryImage("/assets/img/bike45.jpg", "Enduro Bike Service gallery photo 45", "50% 50%"),
      galleryImage("/assets/img/bike46.jpg", "Enduro Bike Service gallery photo 46", "50% 50%"),
      galleryImage("/assets/img/bike47.jpg", "Enduro Bike Service gallery photo 47", "50% 50%"),
      galleryImage("/assets/img/bike48.jpg", "Enduro Bike Service gallery photo 48", "50% 50%"),
      galleryImage("/assets/img/bike49.jpg", "Enduro Bike Service gallery photo 49", "50% 50%"),
      galleryImage("/assets/img/bike50.jpg", "Enduro Bike Service gallery photo 50", "50% 50%"),
      galleryImage("/assets/img/bike51.jpg", "Enduro Bike Service gallery photo 51", "50% 50%"),
      galleryImage("/assets/img/bike52.jpg", "Enduro Bike Service gallery photo 52", "50% 50%"),
      galleryImage("/assets/img/bike53.jpg", "Enduro Bike Service gallery photo 53", "50% 50%"),
      galleryImage("/assets/img/bike54.jpg", "Enduro Bike Service gallery photo 54", "50% 50%"),
      galleryImage("/assets/img/bike56.jpg", "Enduro Bike Service gallery photo 56", "50% 50%"),
      galleryImage("/assets/img/bike57.jpg", "Enduro Bike Service gallery photo 57", "50% 50%"),
      galleryImage("/assets/img/bike58.jpg", "Enduro Bike Service gallery photo 58", "50% 50%"),
    ]
  }
};
  // Expose the same data for all scripts.
  // IMPORTANT: edit gallery pictures only in siteData.gallery.items above.
  window.ENDURO_DATA = siteData;
  window.BKVP_DATA = siteData;

  function getLang(){ return document.body.dataset.lang || document.documentElement.lang || (location.pathname.startsWith('/hr/') ? 'hr' : 'en'); }
  function t(val, lang){ return val && typeof val === 'object' && !Array.isArray(val) ? (val[lang] || val.en || val.hr || '') : (val || ''); }
  function flattenServices(){
    const out = [];
    (siteData.home.servicesOrder || Object.keys(siteData.services)).forEach(key => {
      const cat = siteData.services[key];
      if (!cat) return;
      (cat.items || []).forEach(item => out.push({ categoryKey:key, category:cat, ...item }));
    });
    return out;
  }
  function normalizedText(str=''){ return String(str).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function serviceHref(lang, categoryKey, serviceId, query){
    const base = t(siteData.services[categoryKey].path, lang) || '#';
    const qs = query ? ('?q=' + encodeURIComponent(query)) : '';
    return base + qs + '#' + serviceId;
  }
  function highlight(text, q){
    if (!q) return esc(text);
    const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return esc(text).replace(new RegExp('(' + safeQ + ')', 'ig'), '<mark>$1</mark>');
  }

  function renderHero(){
    const lang = getLang();
    const host = document.querySelector('[data-hero-media]');
    if (!host) return;
    const src = t(siteData.site.heroVideo, lang);
    if (!src) return;
    if (/^vimeo:/i.test(src)) {
      const id = src.split(':')[1];
      host.innerHTML = '<iframe src="https://player.vimeo.com/video/' + id + '?background=1&autoplay=1&loop=1&muted=1" allow="autoplay; fullscreen; picture-in-picture" aria-hidden="true"></iframe>';
    } else {
      host.innerHTML = '<video autoplay muted loop playsinline poster="' + esc(siteData.site.heroPoster || '') + '"><source src="' + esc(src) + '" type="video/mp4"></video>';
    }
  }

  function renderHome(){
    if (!document.body.classList.contains('home')) return;
    const lang = getLang();
    const ui = siteData.home.ui[lang] || siteData.home.ui.en;
    const mount = document.getElementById('js-home-services') || document.getElementById('js-home-services');
    if (mount) {
      mount.innerHTML = siteData.home.servicesOrder.map(key => {
        const cat = siteData.services[key];
        if (!cat) return '';
        return '<a class="tile serviceTile" href="' + esc(t(cat.path, lang)) + '" aria-label="' + esc(ui.categoryAria + ': ' + t(cat.title, lang)) + '">' +
          '<img src="' + esc(cat.cover) + '" alt="' + esc(t(cat.title, lang)) + '" loading="lazy" />' +
          '<span class="tile__label"><span>' + esc(t(cat.title, lang)) + '</span></span>' +
          '<span class="tile__overlay"><span>' + esc(ui.servicesOverlay) + '</span></span>' +
          '</a>';
      }).join('');
    }

    const aboutTitle = document.getElementById('js-about-title');
    const aboutDesc = document.getElementById('js-about-desc');
    const aboutBullets = document.getElementById('js-about-bullets');
    if (aboutTitle) aboutTitle.textContent = t(siteData.about.title, lang);
    if (aboutDesc) aboutDesc.textContent = t(siteData.about.body, lang);
    if (aboutBullets) {
      const bullets = siteData.about.bullets[lang] || [];
      aboutBullets.innerHTML = bullets.map(x => '<li>' + esc(x) + '</li>').join('');
      aboutBullets.hidden = !bullets.length;
    }

    const galleryMount = document.getElementById('js-home-gallery') || document.getElementById('js-home-gallery');
    if (galleryMount) {
      const gallery = siteData.gallery || {};
      const galleryItems = getGalleryItems();
      const first = galleryItems[0];
      if (first) {
        galleryMount.innerHTML = '<article class="latest__row galleryFeature">' +
          '<div class="latest__media"><a class="frameLink" href="' + esc(t(gallery.path, lang)) + '" aria-label="' + esc(ui.galleryOverlay) + '">' +
          '<img id="js-rotating-gallery-image" src="' + esc(first.thumb || first.src) + '" alt="' + esc(first.alt || t(gallery.title, lang)) + '" loading="lazy" decoding="async" style="object-position:' + esc(first.position || '50% 50%') + '" />' +
          '<span class="frameLink__overlay">' + esc(ui.galleryOverlay) + '</span></a></div>' +
          '<div class="latest__text"><h3><a class="textLink" href="' + esc(t(gallery.path, lang)) + '">' + esc(t(gallery.title, lang)) + '</a></h3>' +
          '<p class="latest__descript">' + esc(t(gallery.desc, lang)) + (gallery.instagramUrl ? ' <a class="textLink" href="' + esc(gallery.instagramUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t(gallery.instagramText, lang) || 'Instagram') + '</a>.' : '') + '</p>' +
          '</div></article>';
        startGalleryRotation();
      } else {
        galleryMount.innerHTML = '<div class="emptyState">Add images in js/data.js → siteData.gallery.items.</div>';
      }
    }

    renderGlobalSearch(lang);
  }

  function getGalleryItems(){
    return ((siteData.gallery && siteData.gallery.items) || [])
      .map(item => {
        if (!item) return null;
        if (typeof item === 'string') return { type:'image', src:item, thumb:item, alt:'Bike Photo', position:'50% 50%' };
        const src = item.src || item.url || '';
        if (!src) return null;
        return {
          type: item.type || 'image',
          src,
          thumb: item.thumb || item.poster || src,
          alt: item.alt || 'Bike Photo',
          position: item.position || item.objectPosition || '50% 50%'
        };
      })
      .filter(item => item && item.type === 'image' && item.src);
  }

  function startGalleryRotation(){
    const img = document.getElementById('js-rotating-gallery-image');
    if (!img) return;
    const galleryItems = getGalleryItems();
    if (galleryItems.length < 2) return;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % galleryItems.length;
      const item = galleryItems[idx];
      img.src = item.thumb || item.src;
      img.alt = item.alt || 'Bike Photo';
      img.style.objectPosition = item.position || '50% 50%';
    }, 5000);
  }

  function priceTag(price){ return '<span class="priceTag">' + esc(price) + '</span>'; }

  function renderGlobalSearch(lang){
    const host = document.getElementById('js-service-search');
    if (!host) return;
    const ui = siteData.home.ui[lang] || siteData.home.ui.en;
    host.innerHTML = '<div class="searchCard"><strong>' + esc(ui.searchTitle) + '</strong><p class="muted" style="margin:.4rem 0 .9rem">' + esc(ui.searchHint) + '</p><input id="js-service-search-input" class="searchInput" type="search" placeholder="' + esc(ui.searchPlaceholder) + '" /><div id="js-service-search-results" class="searchResults" style="margin-top:1rem"></div></div>';
    const input = document.getElementById('js-service-search-input');
    const results = document.getElementById('js-service-search-results');
    const all = flattenServices();
    function draw(){
      const raw = input.value.trim();
      const q = normalizedText(raw);
      if (!q) { results.innerHTML = ''; return; }
      const matches = all.filter(item => {
        const hay = normalizedText([t(item.title, 'en'), t(item.title, 'hr'), t(item.desc, 'en'), t(item.desc, 'hr'), ...(item.tags||[])].join(' '));
        return hay.includes(q);
      }).slice(0,10);
      results.innerHTML = matches.length ? matches.map(item => '<a class="searchResult" href="' + esc(serviceHref(lang, item.categoryKey, item.id, raw)) + '"><div class="searchResult__head"><strong>' + highlight(t(item.title, lang), raw) + '</strong>' + priceTag(item.price) + '</div><div class="searchResult__meta"><span>' + esc(t(item.category.title, lang)) + '</span></div><div class="muted">' + highlight(t(item.desc, lang), raw) + '</div></a>').join('') : '<div class="emptyState">' + esc(ui.searchEmpty) + '</div>';
    }
    input.addEventListener('input', draw);
    draw();
  }

  function renderCategoryPage(){
    const categoryKey = document.body.dataset.category;
    if (!categoryKey || !siteData.services[categoryKey]) return;
    const lang = getLang();
    const category = siteData.services[categoryKey];
    const titleEl = document.getElementById('js-gallery-title') || document.getElementById('js-category-title');
    const descEl = document.getElementById('js-gallery-desc') || document.getElementById('js-category-desc');
    if (titleEl) titleEl.textContent = t(category.title, lang);
    if (descEl) descEl.textContent = t(category.desc, lang);
    const grid = document.getElementById('js-gallery-grid') || document.getElementById('js-category-grid');
    if (!grid) return;
    const searchPlaceholder = (siteData.home.ui[lang] || siteData.home.ui.en).searchPlaceholder;
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('q') || '';
    grid.className = '';
    grid.innerHTML = '<div class="service-search"><input id="js-category-search" class="searchInput" type="search" placeholder="' + esc(searchPlaceholder) + '" value="' + esc(initialQuery) + '" /><div id="js-category-results" class="serviceList"></div></div>';
    const input = document.getElementById('js-category-search');
    const results = document.getElementById('js-category-results');
    function draw(){
      const raw = input.value.trim();
      const q = normalizedText(raw);
      const items = !q ? category.items.slice() : category.items.filter(item => normalizedText([t(item.title,'en'),t(item.title,'hr'),t(item.desc,'en'),t(item.desc,'hr'),...(item.tags||[])].join(' ')).includes(q));
      results.innerHTML = items.length ? items.map(item => '<article class="serviceCard" id="' + esc(item.id) + '"><div class="serviceCard__top"><div><h3>' + highlight(t(item.title, lang), raw) + '</h3><p class="muted" style="margin:0">' + highlight(t(item.desc, lang), raw) + '</p></div>' + priceTag(item.price) + '</div></article>').join('') : '<div class="emptyState">' + esc((siteData.home.ui[lang] || siteData.home.ui.en).searchEmpty) + '</div>';
      const nextUrl = location.pathname + (raw ? ('?q=' + encodeURIComponent(raw)) : '') + location.hash;
      history.replaceState(null, '', nextUrl);
      if (location.hash) {
        const id = location.hash.slice(1);
        const target = document.getElementById(id);
        if (target) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 50);
      }
    }
    input.addEventListener('input', draw);
    draw();
  }

  function renderGalleryPage(){
    if (!document.body.dataset.project || document.body.dataset.project !== 'workshop-gallery') return;
    const lang = getLang();
    const titleEl = document.getElementById('js-project-title');
    const descEl = document.getElementById('js-project-desc');
    if (titleEl) titleEl.textContent = t(siteData.gallery.title, lang);
    if (descEl) {
      const gallery = siteData.gallery || {};
      descEl.innerHTML = esc(t(gallery.desc, lang)) + (gallery.instagramUrl ? ' <a class="textLink" href="' + esc(gallery.instagramUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t(gallery.instagramText, lang) || 'Instagram') + '</a>.' : '');
    }
  }

  document.addEventListener('DOMContentLoaded', () => { renderHero(); renderHome(); renderCategoryPage(); renderGalleryPage(); });
})();
