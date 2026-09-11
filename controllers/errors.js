const errorPage = (req, res, next) => {
    res.status(404).render('404Error', {
        pageTitle: 'Page Not Found',
        activePage: '404',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType
    });
};

exports.errorPage = errorPage;
