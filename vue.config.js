module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index Page',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        edit: {
            entry: 'src/pages/edit/main.js',
            template: 'public/index.html',
            filename: 'edit.html',
            title: 'Редактирование объектов',
            chunks: ['chunk-vendors', 'chunk-common', 'edit']
        },
    }
}