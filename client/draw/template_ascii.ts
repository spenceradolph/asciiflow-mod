type Template = {
  name: string;
  ascii: string;
};

const template1: Template = {
  name: "example",
  ascii: `
client        server          client      server
|              |                |            |
v              v                v            v
ssh -p port user@ipaddr -L<ip>:<port>:<ip>:<port> -R<ip>:<port>:<ip>:<port>
^                              ^            
|                              |            
opens listener              opens listener



--------------      --------------      --------------
|            |      |            |      |            |
|            ------->            |      |            |
|    client  >====================------>   server   |
|    server  <===========client==<-------            |
|            |      |            |      |            |
--------------      --------------      --------------

Client: "a piece of computer hardware or software that accesses a service made available by a server"

Server: "a server is a piece of computer hardware or software that provides functionality for other programs or devices, called clients"
`,
};

const template2: Template = {
  name: "dnat example",
  ascii: `
ssh -p 22 user1@2.2.2.2 -L127.0.0.1:2023:3.3.3.3:23 -L127.0.0.1:3022:3.3.3.3:3022
password

telnet -l user2 127.0.0.1 2023
password

cat /proc/sys/net/ipv4/ip_forward #cannot use iptables forwarding without this set to 1

sudo iptables -t nat -A PREROUTING -p tcp --dport 3022 -j DNAT --to-destination 192.168.0.4:22
sudo iptables -t nat -A POSTROUTING -p tcp --dport 22  -j SNAT --to-source 192.168.0.3

sudo iptables -t nat -D PREROUTING -p tcp --dport 3022 -j DNAT --to-destination 192.168.0.4:22
sudo iptables -t nat -D POSTROUTING -p tcp --dport 22  -j SNAT --to-source 192.168.0.3

ssh -p 3022 user3@127.0.0.1
password


    Ops                    Target1                Target2                Target3

E 1.1.1.1            E 2.2.2.2            E 3.3.3.3            E 4.4.4.4
I 10.0.0.1            I 10.2.2.2            I 192.168.0.3        I 192.168.0.4
--------------      --------------      --------------      --------------
|            |      |            |      |            |      |            |
|            ------->22          |      |            |      |            |
|        2023>====================------>23          |      |            |
|        3022>===================------->3022---DNAT-------->22          |
|            |      |            |      |            |      |            |
--------------      --------------      --------------      --------------
                    user1/password        user2/password        user3/password
`,
};

const template3: Template = {
  name: "netsh example",
  ascii: `
ssh -p 22 user1@2.2.2.2 -L127.0.0.1:2023:3.3.3.3:23 -L127.0.0.1:3022:3.3.3.3:3022
password

telnet -l user2 127.0.0.1 2023
password

netsh interface portproxy set v4tov4 listenport=3022 connectaddress=192.168.0.4 connectport=22
#netsh advfirewall firewall add rule name=generic_name dir=in action=allow protocol=TCP localport=3022 #if required

netsh interface portproxy delete v4tov4 listenport=3022 connectaddress=192.168.0.4 connectport=22
#netsh advfirewall firewall delete rule name=generic_name #if required

ssh -p 3022 user3@127.0.0.1
password


    Ops                    Target1                Target2                Target3

E 1.1.1.1            E 2.2.2.2            E 3.3.3.3            E 4.4.4.4
I 10.0.0.1            I 10.2.2.2            I 192.168.0.3        I 192.168.0.4
--------------      --------------      --------------      --------------
|            |      |            |      |            |      |            |
|            ------->22          |      |            |      |            |
|        2023>====================------>23          |      |            |
|        3022>===================------->3022---netsh------->22          |
|            |      |            |      |            |      |            |
--------------      --------------      --------------      --------------
                    user1/password        user2/password        user3/password
`,
};

const template4: Template = {
  name: "tunnel template",
  ascii: `
Tunneling templates

2-hop
--------------      --------------      --------------
|            |      |            |      |            |
|            ------->            |      |            |
|            >====================------>            |
|            <===================<-------            |
|            |      |            |      |            |
--------------      --------------      --------------


3-hop
--------------      --------------      --------------      --------------
|            |      |            |      |            |      |            |
|            ------->            |      |            |      |            |
|            >====================------>            |      |            |
|            <===================<-------            |      |            |
|            >========================================------>            |
|            <=======================================<-------            |
|            >===================------->-socat------------->            |
|            <===================<--------socat------<-------            |
|            |      |            |      |            |      |            |
--------------      --------------      --------------      --------------


4-hop
--------------      --------------      --------------      --------------      --------------
|            |      |            |      |            |      |            |      |            |
|            ------->            |      |            |      |            |      |            |
|            >====================------>            |      |            |      |            |
|            <===================<-------            |      |            |      |            |
|            >========================================------>            |      |            |
|            <=======================================<-------            |      |            |
|            >============================================================------>            |
|            <===========================================================<-------            |
|            >=======================================------->---fpipe----------->            |
|            <=======================================<----------fpipe----<-------            |
|            |      |            |      |            |      |            |      |            |
--------------      --------------      --------------      --------------      --------------
`,
};

// TODO: make this better
export const allTemplates: { [key: string]: Template } = {
  "1": template1,
  "2": template2,
  "3": template3,
  "4": template4,
};
