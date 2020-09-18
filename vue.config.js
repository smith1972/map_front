module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index Page',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        editACP: {
            entry: 'src/pages/editACP/main.js',
            template: 'public/index.html',
            filename: 'editACP.html',
            title: 'Редактирование объектов',
            chunks: ['chunk-vendors', 'chunk-common', 'editACP']
        },
    },
    css: {
        requireModuleExtension: false
    }
}