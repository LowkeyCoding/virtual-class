# Projektbeskrivelse

## Hvad skal jeres projekt være?
Under en karantæne pga. pandemi der det vigtigt at vedvare kommunikation. Vi vil lave et system der faciliterer "en til mange" kommunikation gennem video eller lyd. Derudover skal der være en mere simpel mange til mange tekst kommmunationsmodel. Dette system vil kunne bruges når en autoritet vil sende en besked til flere modtagere og hvor diskurs mellem modtagerne og til afsenderen også skal være muligt.

Et eksempel vil være undervisning hvor en lære kan streame deres undervisning til flere elver og hvor gruppearbejde mellem elverne vil være muligt.

Et system der gøre det nemt for lærer at streame deres undervisning via P2P.
System vil gøre det muligt for elvere at komunikere med deres lærer via en P2P forbindelse.
## Hvordan vil I gribe det an?
Vi vil bruger browseres inbyggede P2P protokol webRTC til at facilitere forbindelsen mellem elver og lærerer.
Via webRTC forbindelsen facilitere vi overførslen af lyd, video og tekst.
Dataen der bliver sendt via webRTC bliver visualiceret på en html frontend.
Læren/webRTC hosten har specielle priviliger der gør at det kun er hosten der kan streame video og lyd. 

## Hvorfor gribe det an på den måde?
Vi vil bruge P2P fordi så alt arbejdet ikke hænger på en enkelt server som gør at det er mere robust.
