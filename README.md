# mrx-work-traffic
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). It shows the time you need to get to work (requires API_KEY). The informations fetched by google.

# Installation
1. Navigate into your MagicMirror's `modules`folder and execute `git clone https://github.com/domsen123/mrx-work-traffic`.

# Config
|Option|Description|
|---|---|
|`apiKey`|API Key from google<br><br>**Type:** `string`<br>This value is **REQUIRED**|

Here is an example of an entry in `config.js`
```
{
	module: 'mrx-work-traffic',
	position: 'top_center',
	header: 'Arbeitsweg',
	config: {
		apikey: 'API_KEY_FROM_GOOGLE',
		origin: 'Platz der Republik 1, 11011 Berlin',
		startTime: '00:00',
		endTime: '23:59',
		destinations: [
			{
				destination: 'Platzl 9, 80331 München',
				label: 'Hofbräuhaus',
				time: null
			}
		]
	}
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Important Notes
- This is one of my first projects using Node, so feel free to submit pull requests or post on the issues/wiki and I will do my best to improve the project.

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.