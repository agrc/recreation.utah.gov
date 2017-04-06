define([

], () => {
    return {
        parseHref(href) {
            href = href.substring(href.indexOf('#') + 1);

            let data = href.split(':');
            let criteria = data.pop();
            let layers = data;

            let fieldData = criteria.split('|');
            const noMatchType = 2;
            const matchType = 3;
            if (fieldData.length === noMatchType) {
                let field = fieldData[0];
                let value = fieldData[1];

                return [layers, field, value];
            } else if (fieldData.length === matchType) {
                let field = fieldData[0];
                let match = fieldData[1];
                let value = fieldData[2];

                return [layers, field, value, match];
            }

            return [layers, ''];
        }
    };
});
