# <p align="center">Forside</p>

<p align="center">Kristian Rud Frydensbjerg Pedersen</p>
<p align="center">Loke Walsted</p>
<p align="center">Soren Saket</p>
<p align="center">25-03-20 - Aarhus Gymnasium</p>

## Abstract


## Indholdsfortegnelse
* [Problemformulering](#problemformulering)
* [Funktionsbeskrivelse](#funktionsbeskrivelse)
* [Dokumentation](#Dokumentation)
* [Udvikling](#Udvikling)
* [Designvalg](#designvalg)
* [Konklusion](#Konklusion)
* [Bilag](#Bilag)

## Problemformulering
Under en karantæne pga. pandemi der det vigtigt at vedvare kommunikation. Vi vil lave et system der faciliterer "en til mange" kommunikation gennem video eller lyd. Derudover skal der være en mere simpel mange til mange tekst kommmunationsmodel. Dette system vil kunne bruges når en autoritet vil sende en besked til flere modtagere og hvor diskurs mellem modtagerne og til afsenderen også skal være muligt.

Et eksempel vil være undervisning hvor en lære kan streame deres undervisning til flere elver og hvor gruppearbejde mellem elverne vil være muligt.

Et system der gøre det nemt for lærer at streame deres undervisning via P2P.
System vil gøre det muligt for elvere at komunikere med deres lærer via en P2P forbindelse.

## Funktionsbeskrivelse
Vi vil bruger browseres inbyggede P2P protokol webRTC til at facilitere forbindelsen mellem elver og lærerer.
Via webRTC forbindelsen facilitere vi overførslen af lyd, video og tekst.
Dataen der bliver sendt via webRTC bliver visualiceret på en html frontend.
Læren/webRTC hosten har specielle priviliger der gør at det kun er hosten der kan streame video og lyd.

### Layout
Programmet indeholder 2 layouts. En forside hvor man kan vælge at deltage i eller starte en stream, og den side hvor en stream kan ses. Layout 2 ændrer sig lidt alt afhængigt af om man er host eller seer.

## Dokumentation
VClass benytter WebRTC til at oprette en peer-to-peer streaming session.

## Udvikling

### Idegenerering
Vi starter med at finde et problem vi gerne vil løse.

### Udvikling af prototype
Vi udvikler et system der kan udføre opgaven. Så tester vi det og noterer eventuelle fejl. 

## Designvalg
Vi har valgt at bruge WebRTC da vi besluttede det var den nemmeste måde at løse vores specifikke problem på. Gennem WebRTC er en peer-to-peer protokol der er indbygget i de fleste browserer. På den måde er der ikke brug for en centraliseret server til kommunikationen.

## Konklusion
ja ...eller er det?

## Bilag

