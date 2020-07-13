function metaIndyFilter(MetaObj, label) {
    return MetaObj.meta.find(indicator => indicator.indicator === label)
}
