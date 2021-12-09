// sir's example for video encoding

import * as CryptoJS from "crypto-js";

function fetchEncryptedImageData(imageId, imageUrl) {
    return this.http.get(imageUrl, { observe: 'response', responseType: 'blob' })
      .pipe(map((res) => {
        let actualBlob = new Blob([res.body], { type: res.headers.get('Content-Type') });
        let a = this.decryptionKey;
        let reader = new FileReader();
        reader.readAsDataURL(actualBlob);
        reader.onloadend = function () {
          let base64data: any = reader.result;
          base64data = atob(base64data.split(',')[1]);
          let rawData = atob(base64data);
          let iv = rawData.substring(0, 16);
          let crypttext = rawData.substring(16);
          crypttext = CryptoJS.enc.Latin1.parse(crypttext);
          iv = CryptoJS.enc.Latin1.parse(iv);
          let b = CryptoJS.enc.Utf8.parse(a);
          let plaintextArray = CryptoJS.AES.decrypt(
            { ciphertext: crypttext },
            b,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
          );
          let finalImg = CryptoJS.enc.Latin1.stringify(plaintextArray);
          finalImg = finalImg.slice(2, finalImg.length - 1);
          // let blob = CommonService.b64toBlob(finalImg, 'image/jpeg');
          // const blobUrl = URL.createObjectURL(blob);
          // return blobUrl;
          // document.getElementById(imageId).setAttribute('src', blobUrl);
          document.getElementById(imageId).setAttribute('src', 'data:image/jpeg;base64,' + finalImg);
        }
        return null;
      }));
  }