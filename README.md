<img src="https://paramation.com/wp-content/uploads/2017/05/logotype-desktop-uai-258x178.png"  width="125" />

---

# TAO UI

## Setup

Install dependencies:

```
yarn
```

Before you can run the app, you need to setup and have `tao-db-server` running on your local machine. Check out https://gitlab.paramation.com/AO-core/tao-db-server

The reason why you need `tao-db-server` running is that `aodb` (which is just an extension of `hyperdb`) does not load on browser. Therefore, my quick and easy hack is I created a server script with api endpoints that will insert/pull data from `aodb`.

After you follow the instructions in https://gitlab.paramation.com/AO-core/tao-db-server, you can run the TAO UI app in development mode:

```
yarn start
```

Things to do before you merge the app back to AO:

1. Replace `hyperdb` with `aodb` in `ao-iptv-core`
2. Replace TAO UI's `get()` / `post()` calls to `tao-db-server` api endpoints with Y-design's `hyperdb` setup.

For examples:

```javascript
const response = await get(`https://localhost/api/get-tao-description?${encodeParams({ taoId: id })}`);
// components/Ide/Ide.js, components/Meet/Meet.js, components/TAODetails/TAODetails.js

const response = await get(`https://localhost/api/get-profile-image?${encodeParams({ nameId: id })}`); // components/NameProfile/NameProfile.js, layouts/TopNavBar/TopNavBar.js

const response = await post(`https://localhost/api/set-tao-description`, { taoId, description: taoDescription }); // components/CreateTAO/CreateTAO.js

const response = await post(`https://localhost/api/upload-profile-image`, { nameId, imageString: formData.imageFile });
```
