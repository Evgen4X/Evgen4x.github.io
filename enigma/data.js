let ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ROTORS = {
	IC: "DMTWSILRUYQNKFEJCAZBPGXOHV",
	IIC: "HQZGPJTMOBLNCIFDYAWVEUSRKX",
	IIIC: "UQNTLSZFMREHDPXKIBVYGJCWOA",
	I: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
	II: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
	III: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
	IV: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
	V: "VZBRGITYUPSDNHLXAWMJQOFECK",
	VI: "JPGVOUMFYQBENHZRDKASXLICTW",
	VII: "NZJHGRCXMYSWBOUFAIVLPEKQDT",
	VIII: "FKQHTLXOCBJSPDZRAMEWNIUYGV",
	UKW: "QYHOGNECVPUZTFDJAXWMKISRBL",
	ETW: "QWERTZUIOASDFGHJKPYXCVBNML",
	"I-K": "PEZUOHXSCVFMTBGLRINQJWAYDK",
	"II-K": "ZOUESYDKFWPCIQXHMVBLGNJRAT",
	"III-K": "EHRVXGAOBQUSIMZFLYNWKTPDJC",
	"UKW-K": "IMETCGFRAYSQBZXWLHKDVUPOJN",
	"ETW-K": "QWERTZUIOASDFGHJKPYXCVBNML",
	EMPTY: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"ABC-BCA": "BCADEFGHIJKLMNOPQRSTUVWXYZ",
};

const REFLECTORS = {
	A: "EJMZALYXVBWFCRQUONTSPIKHGD",
	B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
	C: "FVPJIAOYEDRZXWGCTKUQSBNMHL",
	EMPTY: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

// 13 unique colors for plugboard pairs
const COLORS = ["rgb(255, 87, 51)", "rgb(51, 255, 87)", "rgb(51, 87, 255)", "rgb(255, 51, 161)", "rgb(51, 255, 161)", "rgb(161, 51, 255)", "rgb(255, 140, 51)", "rgb(51, 255, 140)", "rgb(140, 51, 255)", "rgb(255, 215, 0)", "rgb(0, 191, 255)", "rgb(255, 105, 180)", "rgb(139, 69, 19)"];
