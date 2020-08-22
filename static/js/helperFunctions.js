function range(start = 0, end, step=1) {
    if (end === undefined) {
        end = start;
        start = 0;
    }
    return Array.from(Array(end - start), (_, i) => i*step + start)
}