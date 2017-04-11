define([], () => {
    return {
        parseDataAttributes(element) {
            let data = [];
            const allowableLayers = 2;

            for (var i = 0; i < allowableLayers; i++) {
                let option = {
                    layer: element.getAttribute(`data-layer${i + 1}`),
                    attribute: element.getAttribute(`data-attribute${i + 1}`),
                    value: element.getAttribute(`data-value${i + 1}`),
                    match: element.getAttribute(`data-match${i + 1}`)
                };

                if (!option.layer) {
                    continue;
                }

                data.push(option);
            }

            return data;
        }
    };
});
