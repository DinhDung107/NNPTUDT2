module.exports = {
    ConvertTitleToSlug: function (title) {
        let result = title.toLowerCase();
        result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        result = result.replace(/[đĐ]/g, 'd');
        result = result.replace(/([^0-9a-z-\s])/g, '');
        result = result.replace(/(\s+)/g, '-');
        result = result.replace(/^-+|-+$/g, '');
        return result;
    }
}
