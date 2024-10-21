## POC document summary

Summarize PDF documents.

![screenshot](./screenshot.png)

## Running in development

You need to set the following env variable in `.env` file

```
MISTRAL_KEY=
OPENAI_KEY=
```

Then, you have to get a Github Oauth2 keys.    
Go to https://github.com/settings/developers and create a new project. Take note of **Client ID**, **Client secret**.    
Then set **Application Name**, **Homepage URL** to `http://localhost:3333` and **Authorization callback URL** to `http://localhost:3333/login/github/callback`.    

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
```

Then, you need to set the LAGO API key and PORTKEY API key.     
You can get them in their respective dashboards.   
You're likely to run LAGO locally.
```
LAGO_URL=http://localhost:3000/api/v1
LAGO_KEY=

PORTKEY_KEY=
```

You need to generate virtual keys for the LLMs in the PortKey dashboard.
```
MISTRAL_VKEY=
OPENAI_VKEY=
```

Some other env variables are useful, check `.env.example`

Then generate an app key
```
node ace generate:key
```

Finally 
```
pnpm install
pnpm run dev
```
