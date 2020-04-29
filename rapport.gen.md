<!----- Conversion time: 1.891 seconds.


Using this Markdown file:

1. Cut and paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β22
* Wed Apr 29 2020 02:02:52 GMT-0700 (PDT)
* Source doc: Informatik - VClass Rapport
* Tables are currently converted to HTML tables.
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server.

WARNING:
You have 9 H1 headings. You may want to use the "H1 -> H2" option to demote all headings by one level.

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 1; ALERTS: 7.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>
<a href="#gdcalert3">alert3</a>
<a href="#gdcalert4">alert4</a>
<a href="#gdcalert5">alert5</a>
<a href="#gdcalert6">alert6</a>
<a href="#gdcalert7">alert7</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>


<h1>Informatik eksamen

---
</h1>


Kristian Rud Frydensbjerg Pedersen

Loke Walsted

Soren Saket

30-04-20

for reference (delete later!!#?!)(Hvis dette ikke er slettet og rasmus ser det så vil jeg gerne sige: at vi følger din model rigtig godt, og vi lytter i timerne):



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport0.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport0.png "image_tooltip")


<h2>Abstract</h2>


<h1>Indholdsfortegnelse</h1>




---



[TOC]


<h2></h2>


<h1>Problemformulering</h1>




---


Under en karantæne pga. pandemi der det vigtigt at vedvare kommunikation. Vi vil lave et system der faciliterer "en til mange" kommunikation gennem video eller lyd. Derudover skal der være en mere simpel mange til mange tekst kommunikationsmodel. Dette system vil kunne bruges når en autoritet vil sende en besked til flere modtagere og hvor diskurs mellem modtagerne og til afsenderen også skal være muligt.

Et eksempel vil være undervisning hvor en lære kan streame deres undervisning til flere elever og hvor gruppearbejde mellem elever vil være muligt.

Et system der gøre det nemt for lærer at streame deres undervisning via P2P.

System vil gøre det muligt for eleverne at kommunikere med deres lærer via en P2P forbindelse.

Funktionsbeskrivelse

Vi vil bruge browserens indbyggede P2P protokol webRTC til at facilitere forbindelsen mellem elver og lærerer.

Via webRTC forbindelsen facilitere vi overførslen af lyd, video og tekst.

Dataen der bliver sendt via webRTC bliver visualiceret på en html frontend.

Læren/webRTC hosten har specielle privilegier der gør at det kun er hosten der kan streame video og lyd.

<h2></h2>


<h1>Funktionsbeskrivelse</h1>




---


VClass er en bla bla bla...

Programmet er delt op i to skærmlayouts. Den første er dedikeret til opsætning og tilsulttning. Den anden skal repræsentere det virtuelle klasselokale, og er der hvor funktionaliteten finder sted.

<h3></h3>


<h3>Layout 1 - Opsætningsskærm</h3>




<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport1.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport1.png "image_tooltip")


<h4>Kontoopsætning</h4>


Opsætning skærmen er det første man møder når man åbner hjemmesiden. Det eneste skærmen indeholder er en dialogboks der bede brugeren om at oprette en konto. Kontoen er midlertidig og består kun af et brugernavn og et valgfrit billede. Brugeren bliver automatisk tildelt et brugernavn, som er opbygget af to tilfældige navneord. Brugerens standard billede er bestående af bruger navnets startbogstav og en tilfældig baggrundsfarve. Bogstavet ændre sig også når brugeren ændre sit navn. Farven på ikonet kan ændres til et nyt tilfældig farve ved at trykke på billedet. Brugeren kan valgfrit vælge at overskrive det standard billede som bliver generet med en fra et vilkårligt URL. 

Ved valg af et ikke gyldigt brugernavn vil der komme en fejlbesked nederst på siden med en beskrivelse af farven.

Når brugeren har bekræftet sin konto vil en ny dialogboks fremstå.



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport2.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport2.png "image_tooltip")


<h4>Deltagelse i Klasserums </h4>


Denne dialogboks beder brugere om at gå ind i en klasse. Dette kan man gøre på to forskellige måder. Enten kan man vælge at gå ind i et allerede eksisterende rum eller så kan man lave et nyt rum.

Hvis brugeren ønsker at deltage i et allerede eksisterende klasse skal man indtaste rummets identifikationsnummer der for eksempel kan se sådan ud: 6b4cfea4-a896-448d-9611-b5d90b5648c4.

Hvis brugeren derimod ønsker at oprette et nyt rum skal man indtaste rummets navn. Det standarde navn på rummet er brugeres egen navn med “‘s classroom” i enden. Dette kan også ændres senere. 

Når brugeren har gået ind i et rum bliver man refereret til det virtuelle klasselokale (layout 2).

Desuden kan en velkomst boks ses oppe i højre hjørne, hvor det valgte brugernavn og billede bliver vist.

<h3>Layout 2 - Virtuel Klasselokale</h3>




<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport3.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport3.png "image_tooltip")


Layout to er selve det virtuelle klasseværelse, altså der hvor en given stream finder sted. Er opdelt i flere sektioner.

<h4>Chat</h4>


Chatten kan ses som en kolonne til venstre på siden. Nederst er der en indput boks hvor man kan skrive en besked og sende den ved at trykke på Enter. Beskeder bliver vist i boksen med sådan: ([*Brugernavn*]: *besked*). Brugernavnet er markeret med blå.

<h4>Kontrol og Information</h4>


Over streamen kan navnet på klassen ses. Den kan ændres ved at trykke på teksten og indtaste det ønskede klassenavn. Under det bliver klasse Identifikationen vist. Det skal du sende til andre for at de kan deltage i din virtuelle klasse. Under det er der en sektion der kun bliver vist til den der har oprettet klassen (læreren). “Start Capture” knappen starte med at udsende din skærm til alle elever i klassen. “Stop Capture” stopper udsendelsen.

<h4>Video Udsendelse</h4>


Under kontrol og informationssektionen kan video udsendelsen ses. Både læreren og eleverne kan se denne udeladelse. Den har nogle indbyggede knapper der afhænger af browseren. Nederst til venstre kan pause/afspil knappen ses. Den styrer om udsendelsen skal afspilles. Bemærk at den IKKE kontrollerer om udsendelsen bliver sendt eller optaget, kun forhåndsvisningen. Til højre for pause/afspil knappen kan man se hvor lang tid udsendelsen har kørt. På den anden side er der en volumenknap og skyder. Den kan trykkes på for at stumme udsendelsen eller svæves over for at få vist en volume skyder. Yderligere er der en fuld skærm knap og en yderligere indstiller knap.

<h4>Brugere</h4>


Under Video Udsendelses kan en gitter at deltagere ses. De bliver repræsenteret af deres brugerbillede. Man kan svæve musen over billedet for at se brugerens navn.

<h1></h1>


<h1>Teknisk Dokumentation

---
Web teknologier</h1>


Vores kodebase indeholder 3 html filer. Vi har en index.html fil der fungerer som forside. Også kendt som layout 1. Det er fra index.html at vi loader de to andre filer, client.html og host.html der som navnene antyder er der hvor koden til selve det virtuelle klasseværelse, layout 2, både for elever og lærere. index.html og client.html adskiller sig ved at læreren (hosten) kan styrer streamen.

**Layout 1**

Det er som sagt index.html der indeholder koden for forsiden. Al koden i <body> er samlet i en div kaldet “app”, der indeholder flere mindre <div> tags.

Boksen hvori brugeren konfigurer sin information er defineret i <div id=”setup”> tagget. Dette tag indeholder også koden for både at joine og skabe et “klasseværelse”.



<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport4.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport4.png "image_tooltip")


Når man vælger at joine et klasseværelse ved at indtaste dets ID og klikke på knappen join bliver funktionen _joinRoom()_ fra index.js kaldet.


```
// joins a given room
const joinRoom = async () => {
    location.href = '/pages/client.html?peerId=' +  await getPeerId() + "&hostId=" + document.getElementById("roomID").value + "&username=" + username + "&iconUrl=" + encodeURIComponent(iconURL); 
}
```


Denne funktion sammensætter url’en til rummet baseret på den indtastede ID.

**Layout 2**

**Elev**

Efter at have indtastet en gyldig ID vil en given bruger blive sendt ind i det korresponderende klasseværelse. Her benyttes som sagt client.html filen.

**Lærer**

Hvis brugeren vælger at lave et klasseværelse frem for at joine et bliver filen host.html istedet benyttet. Forskellen på den side en lærer og deres elever ser er at læreren har ekstra funktionalitet. Læreren har mulighed for at kontrollerer den videostream alle eleverne modtager i deres ende.

Denne funktionalitet tilføjes af dette <div> der tilføjer de to knapper.



<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport5.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport5.png "image_tooltip")




<h2>WebRTC</h2>


VClass benytter WebRTC til at oprette en peer-to-peer streaming session. Med peer-to-peer kan vi oprette en session uden behov at al vores kommunikation går gennem en central server.

Vores system opretter dog kort forbindelse til en server i starten af en session for af koordinerer peer-to-peer forbindelsen.

Vi har valgt at bruge WebRTC da vi besluttede det var den nemmeste måde at løse vores specifikke problem på. Gennem WebRTC er en peer-to-peer protokol der er indbygget i de fleste browserer. På den måde er der ikke brug for en centraliseret server til kommunikationen.

Med WebRTC har vi som sagt ikke brug for en central-server til håndtering af kommunikationen mellem peers. Det giver en vis uafhængighed. Det skærer også omkostningerne ned at der ikke er brug for en dyr server til håndtering af kommunikationen. Det gør vores løsning ideel for skoler der ikke har et etableret system til hjemmeundervisning, da vores kun kræver en browser med indbygget WebRTC, hvilket alle moderne browsere har.

<h3>PeerJS</h3>


I vores projekt benytter vi et tredjeparts javascript-library ved navn PeerJS til at udnytte den indbyggede WebRTC funktionalitet i moderne browserer. PeerJS 



<h1>Udvikling og Design</h1>




---


**Idegenerering**

Vi starter med at finde et problem vi gerne vil løse. Dette problem er at det kan være svært at holde virtuel undervisning. Vi beslutter os for at finde en løsning på dette.

<h3>Udvikling af prototype</h3>


Vi udvikler et system der kan udføre opgaven. Det vil sige en meget generel barebones løsning der kun lige er i stand til at udføre kerneopgaven.

**Dataflow**

På opsætnings siden skabes den første del af data der associeres med den nuværende bruger. Hvis brugeren er en klient bliver klientens peer id, brugernavn, profilbillede og det valgte klasserums id gemt. Hvis brugeren er en host bliver brugerens peer id, brugernavn, profilbillede,  og klasserums navnet gemt. Denne data bliver sendt videre som parameter i url’et til enten klient eller host siden alt efter hvad brugeren er. 

For at sikre programmet har de tidligere nævnte data punkter standardværdier som sikre at webapplikationen ikke  går i stå hvis folk tilgår klient eller host siden uden at sætte de nødvendige parameter. 

Klient siden starter med at tage parametrene der er blevet sendt via url’et til at konstruere “VirtualClass” js klassen. Når “VirtualClass” er blevet konstrueret begynder processen til at forbinde til hosten. Under processen til at forbinde til hosten bliver klientens brugernavn, profilbillede og peer id brugt som parametre til at oprette forbindelsen. Grunden til at have profilbillede og brugernavnet som en del af forbindelses parametrene er at de bliver uforanderlige når forbindelsen er blevet oprettet. Det gør at man ikke kan skifte brugernavn eller profilbillede midt i en time for at forvirre eller snyde læren. 

Når forbindelsen er oprettet sender hosten information om de andre forbundne elever, samt sender en besked til de andre forbundne elever om at en ny elever har forbundet

**Test af program**

Til sidst tester vi programmet for at se om det kan holde til intensiv brug. Programmet testes ved at holde undervisning til for et antal elever gennem systemet.

<h3></h3>


<h2>Brugeroplevelse</h2>


En af de vigtige fokusmål vi havde få applikationen var at den skulle være nemt at bruge. Under en epidemi kan der være en masse nye ting der fylder i hverdagen. For at gøre opsætningen til digital undervisning så nemt så muligt skal man fjerne “friktion”. Friktion er også et term brugt i softwareudvikling og beskriver hvor svært det er for brugeren at udfører deres mål med det givne software. 

Vi har taget design beslutnigner i designet af brugerfladen der understøtter dette mål ved at fjerne rod og kompleksitet. Med layout 1 har vores fokus været på at den skulle være nem at bruge. Siden er derfor meget simpel og giver brugeren få muligheder ad gangen. Dialogbokse har en tydelig overskrift der informere brugeren af handlinger der kommer til at foregå. 

Funktionalitet med at skifte farven på brugerprofilen er gemt væk ligesom en “easter egg”, da det ikke er nødvendig for hoved funktionaliteten.

Den røde prik en en industristandard i formler for at vise påkrævede felter.

Alle input felter har en lille animation der viser om den er valgt for at øge feedback. Dette er vigtigt for at informere brugeren resultatet af deres handlinger.



<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/VClass-Rapport6.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/VClass-Rapport6.png "image_tooltip")


Selve skærm udsendelsen er designet for at  skulle ligne et rigtigt klasseværelse. Dette er fordi at hele idéen med programmet er, at det skal være et virtuelt klasseværelse. Vi har derfor forsøgt at “indrette” siden på samme måde som et klasseværelse. Hvor video udsendelsen skal repræsentere et smartboard og cirkelerne de enkelter elever Dette design valg er klassificeret som skeuomorfisme.

<h2></h2>


<h1>Konklusion</h1>




---


ja ...eller er det?

<h2></h2>


<h1>Bilag</h1>




---



<!-- Docs to Markdown version 1.0β22 -->
