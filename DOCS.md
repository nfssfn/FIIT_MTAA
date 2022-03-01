# [MTAA] Zadanie 1 – SIP Proxy
### Andrei Cherkas - [GitHub Link](https://github.com/nfssfn/FIIT_MTAA)

## Solution
Pri rieseni tohto zadania bol pouzity programovaci jazyk Javascript s pouzitim platformy Node.js.
Ako zaklad, bola pouzita [tato SIP kniznica](https://github.com/kirm/sip.js). Nasledovne do kniznici boli doimplementovane:
- logger (loguje aktivitu proxy)
- registrator (registruje userov)
- uprava responde code textu

Ako klienty boli pouzite LinPhone a Zoiper5.
> Pre klient LinPhone: V nastaveniach je potrebne vypnut LinPhone proxy (Netwiorking -> UDP/TCP)

## Getting Started
Proxy sa zapina spustenim suboru `index.js`, ktory sa nachadza v hlavnom priecinku projektu.
`index.js` spusti metodu `.start()` z pouzitej SIP kniznici, ktora nastartuje SIP Server. Po zapnuti, proxy vypise IP adresu nastartovaneho SIP Server. Pouziva sa standartny port `:5060`.

## Features
- [X] [(pcap)](./traces/Register.pcap) Registrácia účastníka  
  - implementacia v moduli `modules/registerUser.js`  
- [X] [(pcap)](./traces/Ringing.pcap) Vytočenie hovoru a zvonenie na druhej strane  
- [X] [(pcap)](./traces/AcceptedCall.pcap) Prijatie hovoru druhou stranou, fungujúci hlasový hovor  
- [X] [(pcap)](./traces/DeclineCancelBusy.pcap) Ukončenie hlasového hovoru (prijatého aj neprijatého)  
  
## Additional Features
- [X] [(pcap)](./traces/Conference.pcap) Možnosť zrealizovať konferenčný hovor (aspoň 3 účastníci)  
- [X] [(pcap)](./traces/CallTransfer.pcap) Možnosť presmerovať hovor  
- [X] [(pcap)](./traces/VideoCall.pcap) Možnosť realizovať videohovor  
- [X] [(pcap)](./traces/Logger.pcap) Logovanie “denníka hovorov” – kto kedy komu volal, kedy bol ktorý hovor prijatý, kedy bol ktorý hovor ukončený, do ľubovoľného textového súboru v ľubovoľnom formáte  
  - implementacia v moduli `modules/callLogger.js`
- [X] [(pcap)](./traces/Logger.pcap) Úprava SIP stavových kódov z zdrojovom kóde proxy, napr. “486 Busy Here” zmeníte na “486 Obsadené”
  - implementacia v hlavnom module `index.js`
