function styleScoringIndicatorHeader(currentCell, label) {
    currentCell.setValue(label);
    currentCell.setWrap(true);
    currentCell.setBackgroundRGB(157, 179, 176);
    currentCell.setVerticalAlignment("top");
    currentCell.setHorizontalAlignment('center');
    return currentCell;
}
