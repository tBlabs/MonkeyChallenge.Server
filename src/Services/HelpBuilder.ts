
export class HelpBuilder
{
    private glossaries: { key: string; value: string; }[] = [];
    private configs: { key: string; value: string; defaultValue: string; example: string; source: string; }[] = [];
    private statuses: { key: string; value: string; }[] = [];
    private apis: { url: string; purpose: string; }[] = [];

    constructor(private appName: string)
    { }

    public Glossary(key: string, value: string): this
    {
        this.glossaries.push({ key, value });

        return this;
    }

    public Config(key: string, value: string, defaultValue: string = "", example: string = "", source: string = ""): this
    {
        this.configs.push({ key, value, defaultValue, example, source });

        return this;
    }

    public Status(key: string, value: () => string): this
    {
        this.statuses.push({ key, value: value() });

        return this;
    }

    public Api(url: string, purpose: string): this
    {
        this.apis.push({ url, purpose });

        return this;
    }

    private LineBreak = "<br /><br />";
    private NewLine = "<br />";

    private get Glossaries()
    {
        if (this.glossaries.length === 0) return "";

        return `<dl>` + this.glossaries.map(d => `<dt style="font-weight: bold">${d.key}</dt><dd>${d.value}</dd>`).join('') + `</dl>`;
    }

    private get Configs()
    {
        if (this.configs.length === 0) return "";

        return `<table><tr><th>Key</th><th>Value</th><th>Default</th><th>Example</th><th>Source</th></tr>`
            + this.configs.map(c => `<tr><td>${c.key}</td><td style="font-weight: bold">${c.value}</td><td>${c.defaultValue}</td><td>${c.example}</td><td>${c.source}</td></tr>`).join('')
            + `</table>`;
    }

    private get Statuses()
    {
        if (this.statuses.length === 0) return "";

        return `<table><tr><th>Indicator</th><th>Status</th></tr>`
            + this.statuses.map(s => `<tr><td>${s.key}</td><td>${s.value}</td></tr>`).join('')
            + `</table>`;
    }

    private get Apis()
    {
        if (this.apis.length === 0) return "";

        return `<table><tr><th>Url</th><th>Purpose</th></tr>`
            + this.apis.map(a => `<tr><td style="font-weight: bold"><a href=${a.url}>${a.url}</a></td><td>${a.purpose}</td></tr>`).join('')
            + `</table>`;
    }

    public get Styles()
    {
        return `<style>
        div {
            padding: 18px;
            margin: 0;
        }

        p {
            font-weight: bold;
            color: maroon;
            font-size: 28px;
        }

        a {
            color: maroon;
        }

        dt {
            margin-top: 12px;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
        }
          
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        </style>`;
    }

    private Header(text: string)
    {
        return `<p>${text}</p>`;
    }

    private Section(header, text)
    {
        if (text.length === 0) return "";

        return this.Header(header) + text + this.LineBreak;
    }

    public ToString()
    {
        return this.Styles
            + '<div>'
            + this.Header(`Welcom to ${this.appName}`)
            + '<hr>'
            + this.Section("Glossary", this.Glossaries)
            + this.Section("Status", this.Statuses)
            + this.Section("Config", this.Configs)
            + this.Section("API", this.Apis)
            + '</div>';
    }
}
