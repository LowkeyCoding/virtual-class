# Projektbeskrivelse

## Hvad skal jeres projekt være?
Et system der gøre det nemt for lærer at streame deres undervisning via P2P.
System vil gøre det muligt for elvere at komunikere med deres lærer via en P2P forbindelse.
## Hvordan vil I gribe det an?
Vi vil bruger browseres inbyggede P2P protokol webRTC til at facilitere forbindelsen mellem elver og lærerer.
Via webRTC forbindelsen facilitere vi overførslen af lyd, video og tekst.
Dataen der bliver sendt via webRTC bliver visualiceret på en html frontend.
Læren/webRTC hosten har specielle priviliger der gør at det kun er hosten der kan streame video og lyd. 

## Hvorfor gribe det an på den måde?
Vi vil bruge P2P fordi så alt arbejdet ikke hænger på en enkelt server som gør at det er mere robust.
