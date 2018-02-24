const md5 = require('./md5');
const base64 = require('./base64');

const VieHashing = {
    secretString: 'lkjhhfu484629fhdfgsgfjk3937dhksh',
    salt: '94729fjhgadhwkdxwueodjd893729',
    saltSeperator: '',

    /**
     * Ham dung de dao nguoc 1 chuoi
     *
     * @param  string  input: chuoi can dao nguoc
     */
    strrev: function(input) {
        return input.split('').reverse().join('');
    },
    
    /**
     * Ham dung de hash 1 password va co su dung salt va secret string de securepasword
     *
     * @param  string  $input: password
     * @param  boolean $full: if $full == true : create full hashing string: used to create password; if $full == false: only return password hashing prefix(used for remember me to save cookie)
     */
    hash: function(input, full) {
        full = full || true;

        if (full) {
            return md5(input + VieHashing.salt) + VieHashing.saltSeperator + base64.encode(md5(VieHashing.secretString) + VieHashing.salt);
        } else {
            return md5(input + VieHashing.salt);
        }
    },

    /**
     * ham dung de encoding 1 string bang base64_encode
     *  - nhung dung ket hop 1 so ky thuat, de secure result
     *
     * @param string $input
     */
    superBase64Encode: function(input) {
        let output = input;
        output = base64.encode(output);
        output = VieHashing.strrev(output);
        output = base64.encode(output);
        output = base64.encode(output);
        output = VieHashing.strrev(output);

        return output;
    },

    /**
     * Decode cho ham superBase64Encode
     *
     * @param  unknown_type $input
     * @return unknown
     */
    superBase64Decode: function(input) {
        output = input;
        output = VieHashing.strrev(output);
        output = base64.decode(output);
        output = base64.decode(output);
        output = VieHashing.strrev(output);
        output = base64.decode(output);

        return output;
    },

    /**
     * Dung de authenticate password
     *
     *
     * @param string $src: password can so sanh
     * @param string $dest: password duoc luu tru trong db, co format; {HASH}{SALT_SEPERATOR}{ENCODEDSALT} (HASH = MD5({password}{$SALT}), ENCODEDSALT = BASE64ENCODE(MD5(SECRETSTRING).{$SALT}))
     */
    authenticate: function(src, dest) {
        //get salt from destination
        const group = dest.split(VieHashing.saltSeperator);
        const hash = group[0];

        const oldSalt = base64.decode(group[1]).substr(32);

        return hash == md5(src + oldSalt);
    },

    /**
     * Ham dung de convert tu 1 chuoi da duoc hashing ngan (de luu vao cookie)
     *  sang chuoi password day du, dung de so sanh voi password goc
     *
     * @param  string $input
     * @return string
     */
    convertToFullString: function(input) {
        return input + VieHashing.saltSeperator + base64.encode(md5(VieHashing.secretString) + VieHashing.salt);
    },

    /**
     * Ham dung de tao cookie vao luu xuong pc cua user, dung cho chuc nang "remember me"
     *
     * @param  int    $userId
     * @param  string $password
     * @return string
     */
    cookiehashing: function(userId, password) {
        return VieHashing.superBase64Encode(userId) + VieHashing.saltSeperator + VieHashing.superBase64Encode(VieHashing.hash(password, false));
    },

    cookiehasingParser: function(cookieHashing) {
        const group = cookieHashing.split(VieHashing.saltSeperator);
        let rememberMeInfo = {
            userid: VieHashing.superBase64Decode(group[0]),
            shortPasswordString: VieHashing.superBase64Decode(group[1])
        };

        return rememberMeInfo;
    },

    authenticateCookiehashing: function(shortPasswordString, fullPasswordString) {
        const group = fullPasswordString.split(VieHashing.saltSeperator);

        return (group[0] == shortPasswordString);
    }
}

module.exports = VieHashing;