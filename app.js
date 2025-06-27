class SortingVisualizer {
    constructor() {
        this.canvas = document.getElementById('arrayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.arraySize = 50;
        this.animationSpeed = 5;
        this.isAnimating = false;
        this.isPaused = false;
        this.currentAlgorithm = 'bubbleSort';
        this.animationId = null;
        this.startTime = null;
        
        // Statistics
        this.comparisons = 0;
        this.swaps = 0;
        
        // Animation states
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.pivot = [];
        
        // Colors
        this.colors = {
            default: '#61dafb',
            comparing: '#ff6b6b',
            swapping: '#51cf66',
            sorted: '#4c6ef5',
            pivot: '#ffd43b'
        };
        
        // Algorithm complexities
        this.complexities = {
            bubbleSort: {best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)"},
            selectionSort: {best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)"},
            insertionSort: {best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)"},
            mergeSort: {best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)"},
            quickSort: {best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)"},
            heapSort: {best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)"},
            radixSort: {best: "O(d(n+k))", average: "O(d(n+k))", worst: "O(d(n+k))", space: "O(n+k)"},
            countingSort: {best: "O(n+k)", average: "O(n+k)", worst: "O(n+k)", space: "O(k)"},
            bucketSort: {best: "O(n+k)", average: "O(n+k)", worst: "O(n²)", space: "O(n)"}
        };
        
        this.algorithmDescriptions = {
            bubbleSort: "Bubble Sort repeatedly compares adjacent elements and swaps them if they're in the wrong order.",
            selectionSort: "Selection Sort finds the minimum element and places it at the beginning, then repeats for the remaining array.",
            insertionSort: "Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position.",
            mergeSort: "Merge Sort divides the array into halves, sorts them recursively, then merges the sorted halves.",
            quickSort: "Quick Sort selects a pivot element and partitions the array around it, then recursively sorts the partitions.",
            heapSort: "Heap Sort builds a max heap from the array, then repeatedly extracts the maximum element.",
            radixSort: "Radix Sort sorts elements by processing individual digits from least to most significant digit.",
            countingSort: "Counting Sort counts occurrences of each element and uses this information to place elements in order.",
            bucketSort: "Bucket Sort distributes elements into buckets, sorts each bucket individually, then concatenates results."
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
        this.updateComplexityDisplay();
    }
    
    initializeElements() {
        this.arraySizeSlider = document.getElementById('arraySize');
        this.speedSlider = document.getElementById('animationSpeed');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.generateBtn = document.getElementById('generateArray');
        this.startBtn = document.getElementById('startSort');
        this.pauseBtn = document.getElementById('pauseResume');
        this.resetBtn = document.getElementById('reset');
        
        // Display elements
        this.arraySizeValue = document.getElementById('arraySizeValue');
        this.speedValue = document.getElementById('speedValue');
        this.currentAlgorithmEl = document.getElementById('currentAlgorithm');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.executionTimeEl = document.getElementById('executionTime');
        this.algorithmInfoEl = document.getElementById('algorithmInfo');
        
        // Complexity display elements
        this.bestCaseEl = document.getElementById('bestCase');
        this.averageCaseEl = document.getElementById('averageCase');
        this.worstCaseEl = document.getElementById('worstCase');
        this.spaceComplexityEl = document.getElementById('spaceComplexity');
        
        // Special visualization elements
        this.specialVisualization = document.getElementById('specialVisualization');
        this.specialVizTitle = document.getElementById('specialVizTitle');
        this.specialVizContent = document.getElementById('specialVizContent');
    }
    
    setupEventListeners() {
        this.arraySizeSlider.addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            this.arraySizeValue.textContent = this.arraySize;
            if (!this.isAnimating) {
                this.generateArray();
            }
        });
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = this.animationSpeed;
        });
        
        this.algorithmSelect.addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            this.updateComplexityDisplay();
            this.hideSpecialVisualization();
        });
        
        this.generateBtn.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.generateArray();
            }
        });
        
        this.startBtn.addEventListener('click', () => {
            this.startSorting();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
    }
    
    generateArray() {
        this.array = [];
        this.sorted = [];
        this.comparing = [];
        this.swapping = [];
        this.pivot = [];
        
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }
        
        this.resetStatistics();
        this.drawArray();
    }
    
    resetStatistics() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = null;
        this.updateStatisticsDisplay();
    }
    
    updateStatisticsDisplay() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
        
        if (this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.executionTimeEl.textContent = elapsed.toFixed(2) + 's';
        } else {
            this.executionTimeEl.textContent = '0.00s';
        }
    }
    
    updateComplexityDisplay() {
        const complexity = this.complexities[this.currentAlgorithm];
        const algorithmName = this.algorithmSelect.options[this.algorithmSelect.selectedIndex].text;
        
        this.currentAlgorithmEl.textContent = algorithmName;
        this.bestCaseEl.textContent = complexity.best;
        this.averageCaseEl.textContent = complexity.average;
        this.worstCaseEl.textContent = complexity.worst;
        this.spaceComplexityEl.textContent = complexity.space;
        this.algorithmInfoEl.textContent = this.algorithmDescriptions[this.currentAlgorithm];
    }
    
    drawArray() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Set canvas size based on container
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / this.array.length;
        const maxHeight = canvas.height - 40;
        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const barHeight = (value / maxValue) * maxHeight;
            const x = index * barWidth;
            const y = canvas.height - barHeight;
            
            // Determine bar color
            let color = this.colors.default;
            if (this.pivot.includes(index)) {
                color = this.colors.pivot;
            } else if (this.swapping.includes(index)) {
                color = this.colors.swapping;
            } else if (this.comparing.includes(index)) {
                color = this.colors.comparing;
            } else if (this.sorted.includes(index)) {
                color = this.colors.sorted;
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
            
            // Draw value labels for smaller arrays
      // Draw value labels for smaller arrays
            if (this.array.length <= 100) {
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(value, x + barWidth/2, y - 5);
            }
        });
    }
    
    async startSorting() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isPaused = false;
        this.startTime = Date.now();
        
        // Reset statistics
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStatisticsDisplay();
        
        // Update UI
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.pauseBtn.textContent = 'Pause';
        this.generateBtn.disabled = true;
        this.algorithmSelect.disabled = true;
        
        // Reset arrays
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.pivot = [];
        
        // Start statistics update timer
        this.statsUpdateTimer = setInterval(() => {
            if (!this.isPaused) {
                this.updateStatisticsDisplay();
            }
        }, 100);
        
        try {
            await this[this.currentAlgorithm]();
            this.markAllSorted();
        } catch (error) {
            console.error('Sorting error:', error);
        }
        
        clearInterval(this.statsUpdateTimer);
        this.completeSorting();
    }
    
    // FIXED: Improved sleep function with better pause handling
    async sleep(ms = null) {
        const actualDelay = ms || Math.max(10, 210 - (this.animationSpeed * 20));
        
        return new Promise((resolve) => {
            const checkPause = () => {
                if (!this.isAnimating) {
                    resolve();
                    return;
                }
                
                if (this.isPaused) {
                    // Check again in 50ms if still paused
                    setTimeout(checkPause, 50);
                } else {
                    // Not paused, proceed with normal delay
                    setTimeout(resolve, actualDelay);
                }
            };
            
            checkPause();
        });
    }
    
    // FIXED: Simplified and more reliable pause check
    async waitIfPaused() {
        while (this.isPaused && this.isAnimating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Check if animation was stopped while paused
        if (!this.isAnimating) {
            throw new Error('Animation stopped');
        }
    }
    
    // FIXED: Improved toggle pause function
    togglePause() {
        if (!this.isAnimating) return;
        
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        // Update UI state
        this.generateBtn.disabled = this.isPaused ? false : true;
        this.algorithmSelect.disabled = this.isPaused ? false : true;
    }
    
    reset() {
        this.isAnimating = false;
        this.isPaused = false;
        
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
        
        if (this.statsUpdateTimer) {
            clearInterval(this.statsUpdateTimer);
        }
        
        // Reset UI
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.generateBtn.disabled = false;
        this.algorithmSelect.disabled = false;
        
        this.generateArray();
        this.hideSpecialVisualization();
    }
    
    completeSorting() {
        this.isAnimating = false;
        this.isPaused = false;
        
        // Reset UI
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.generateBtn.disabled = false;
        this.algorithmSelect.disabled = false;
        
        this.updateStatisticsDisplay();
    }
    
    markAllSorted() {
        this.sorted = Array.from({length: this.array.length}, (_, i) => i);
        this.comparing = [];
        this.swapping = [];
        this.pivot = [];
        this.drawArray();
    }
    
    showSpecialVisualization(title, content) {
        this.specialVizTitle.textContent = title;
        this.specialVizContent.innerHTML = content;
        this.specialVisualization.style.display = 'block';
    }
    
    hideSpecialVisualization() {
        this.specialVisualization.style.display = 'none';
    }
    
   
    async bubbleSort() {
        for (let i = 0; i < this.array.length - 1; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                await this.waitIfPaused(); 
                
                this.comparing = [j, j + 1];
                this.comparisons++;
                this.drawArray();
                await this.sleep();
                
                if (this.array[j] > this.array[j + 1]) {
                    this.swapping = [j, j + 1];
                    this.swaps++;
                    this.drawArray();
                    await this.sleep();
                    
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.drawArray();
                    await this.sleep();
                }
                
                this.comparing = [];
                this.swapping = [];
            }
            this.sorted.push(this.array.length - 1 - i);
        }
        this.sorted.push(0);
    }
    
    async selectionSort() {
        for (let i = 0; i < this.array.length - 1; i++) {
            let minIdx = i;
            this.pivot = [i];
            
            for (let j = i + 1; j < this.array.length; j++) {
                await this.waitIfPaused(); // FIXED: Added pause check
                
                this.comparing = [minIdx, j];
                this.comparisons++;
                this.drawArray();
                await this.sleep();
                
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                this.swapping = [i, minIdx];
                this.swaps++;
                this.drawArray();
                await this.sleep();
                
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.drawArray();
                await this.sleep();
            }
            
            this.sorted.push(i);
            this.comparing = [];
            this.swapping = [];
            this.pivot = [];
        }
        this.sorted.push(this.array.length - 1);
    }
    
    async insertionSort() {
        this.sorted.push(0);
        
        for (let i = 1; i < this.array.length; i++) {
            let key = this.array[i];
            let j = i - 1;
            this.pivot = [i];
            
            while (j >= 0) {
                await this.waitIfPaused(); // FIXED: Added pause check
                
                this.comparing = [j, i];
                this.comparisons++;
                this.drawArray();
                await this.sleep();
                
                if (this.array[j] <= key) break;
                
                this.swapping = [j, j + 1];
                this.array[j + 1] = this.array[j];
                this.swaps++;
                this.drawArray();
                await this.sleep();
                
                j--;
            }
            
            this.array[j + 1] = key;
            this.sorted.push(i);
            this.comparing = [];
            this.swapping = [];
            this.pivot = [];
            this.drawArray();
            await this.sleep();
        }
    }
    
    async mergeSort() {
        await this.mergeSortHelper(0, this.array.length - 1);
    }
    
    async mergeSortHelper(left, right) {
        if (left >= right) return;
        
        await this.waitIfPaused(); // FIXED: Added pause check
        
        const mid = Math.floor((left + right) / 2);
        await this.mergeSortHelper(left, mid);
        await this.mergeSortHelper(mid + 1, right);
        await this.merge(left, mid, right);
    }
    
    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            this.comparing = [left + i, mid + 1 + j];
            this.comparisons++;
            this.drawArray();
            await this.sleep();
            
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            this.swapping = [k];
            this.swaps++;
            this.drawArray();
            await this.sleep();
            k++;
        }
        
        while (i < leftArr.length) {
            await this.waitIfPaused(); // FIXED: Added pause check
            this.array[k] = leftArr[i];
            this.swapping = [k];
            this.drawArray();
            await this.sleep();
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            await this.waitIfPaused(); // FIXED: Added pause check
            this.array[k] = rightArr[j];
            this.swapping = [k];
            this.drawArray();
            await this.sleep();
            j++;
            k++;
        }
        
        this.comparing = [];
        this.swapping = [];
    }
    
    async quickSort() {
        await this.quickSortHelper(0, this.array.length - 1);
    }
    
    async quickSortHelper(low, high) {
        if (low < high) {
            await this.waitIfPaused(); // FIXED: Added pause check
            const pi = await this.partition(low, high);
            await this.quickSortHelper(low, pi - 1);
            await this.quickSortHelper(pi + 1, high);
        }
    }
    
    async partition(low, high) {
        const pivot = this.array[high];
        this.pivot = [high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            this.comparing = [j, high];
            this.comparisons++;
            this.drawArray();
            await this.sleep();
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    this.swapping = [i, j];
                    this.swaps++;
                    this.drawArray();
                    await this.sleep();
                    
                    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                    this.drawArray();
                    await this.sleep();
                }
            }
        }
        
        this.swapping = [i + 1, high];
        this.swaps++;
        this.drawArray();
        await this.sleep();
        
        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.sorted.push(i + 1);
        this.comparing = [];
        this.swapping = [];
        this.pivot = [];
        this.drawArray();
        await this.sleep();
        
        return i + 1;
    }
    
    async heapSort() {
        // Build max heap
        for (let i = Math.floor(this.array.length / 2) - 1; i >= 0; i--) {
            await this.heapify(this.array.length, i);
        }
        
        // Extract elements from heap one by one
        for (let i = this.array.length - 1; i > 0; i--) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            this.swapping = [0, i];
            this.swaps++;
            this.drawArray();
            await this.sleep();
            
            [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
            this.sorted.push(i);
            this.drawArray();
            await this.sleep();
            
            await this.heapify(i, 0);
        }
        this.sorted.push(0);
    }
    
    async heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < n) {
            await this.waitIfPaused(); // FIXED: Added pause check
            this.comparing = [left, largest];
            this.comparisons++;
            this.drawArray();
            await this.sleep();
            
            if (this.array[left] > this.array[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            await this.waitIfPaused(); // FIXED: Added pause check
            this.comparing = [right, largest];
            this.comparisons++;
            this.drawArray();
            await this.sleep();
            
            if (this.array[right] > this.array[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            this.swapping = [i, largest];
            this.swaps++;
            this.drawArray();
            await this.sleep();
            
            [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
            this.drawArray();
            await this.sleep();
            
            await this.heapify(n, largest);
        }
        
        this.comparing = [];
        this.swapping = [];
    }
    
    async radixSort() {
        const max = Math.max(...this.array);
        const maxDigits = max.toString().length;
        
        this.showSpecialVisualization('Radix Sort Process', `
            <div class="radix-info">
                <strong>Max Value:</strong> ${max}<br>
                <strong>Max Digits:</strong> ${maxDigits}<br>
                <strong>Current Digit:</strong> <span class="current-digit" id="currentDigit">1</span>
            </div>
            <div class="buckets-container" id="bucketsContainer">
                ${Array.from({length: 10}, (_, i) => `
                    <div class="bucket">
                        <span class="bucket-label">Bucket ${i}:</span>
                        <span class="bucket-content" id="bucket${i}">[]</span>
                    </div>
                `).join('')}
            </div>
        `);
        
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            await this.countingSortForRadix(exp);
            const currentDigitEl = document.getElementById('currentDigit');
            if (currentDigitEl) {
                currentDigitEl.textContent = Math.log10(exp) + 1;
            }
        }
    }
    
    async countingSortForRadix(exp) {
        const output = new Array(this.array.length);
        const count = new Array(10).fill(0);
        
        // Count occurrences of each digit
        for (let i = 0; i < this.array.length; i++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            const digit = Math.floor(this.array[i] / exp) % 10;
            count[digit]++;
            
            // Update bucket display
            for (let j = 0; j < 10; j++) {
                const bucketEl = document.getElementById(`bucket${j}`);
                if (bucketEl) {
                    const bucketElements = this.array.filter(val => Math.floor(val / exp) % 10 === j);
                    bucketEl.textContent = `[${bucketElements.join(', ')}]`;
                }
            }
            
            await this.sleep();
        }
        
        // Change count[i] so that count[i] contains actual position
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array
        for (let i = this.array.length - 1; i >= 0; i--) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            const digit = Math.floor(this.array[i] / exp) % 10;
            output[count[digit] - 1] = this.array[i];
            count[digit]--;
            
            this.swapping = [i];
            this.swaps++;
            this.drawArray();
            await this.sleep();
        }
        
        // Copy output array to original array
        for (let i = 0; i < this.array.length; i++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            this.array[i] = output[i];
            this.swapping = [i];
            this.drawArray();
            await this.sleep();
        }
        
        this.comparing = [];
        this.swapping = [];
    }
    
    async countingSort() {
        const max = Math.max(...this.array);
        const min = Math.min(...this.array);
        const range = max - min + 1;
        const count = new Array(range).fill(0);
        const output = new Array(this.array.length);
        
        this.showSpecialVisualization('Counting Sort Process', `
            <div class="counting-array-container">
                <h5>Counting Array:</h5>
                <div id="countingArray"></div>
            </div>
            <div class="counting-array-container">
                <h5>Cumulative Array:</h5>
                <div id="cumulativeArray"></div>
            </div>
        `);
        
        // Count occurrences
        for (let i = 0; i < this.array.length; i++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            count[this.array[i] - min]++;
            this.comparing = [i];
            this.drawArray();
            
            // Update counting array display
            this.updateCountingDisplay(count, null, min);
            await this.sleep();
        }
        
        // Calculate cumulative count
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }
        
        this.updateCountingDisplay(count, count.slice(), min);
        
        // Build output array
        for (let i = this.array.length - 1; i >= 0; i--) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            output[count[this.array[i] - min] - 1] = this.array[i];
            count[this.array[i] - min]--;
            
            this.swapping = [i];
            this.swaps++;
            this.drawArray();
            await this.sleep();
        }
        
        // Copy output to original array
        for (let i = 0; i < this.array.length; i++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            this.array[i] = output[i];
            this.swapping = [i];
            this.drawArray();
            await this.sleep();
        }
        
        this.comparing = [];
        this.swapping = [];
    }
    
    updateCountingDisplay(countArray, cumulativeArray, min) {
        const countingDiv = document.getElementById('countingArray');
        const cumulativeDiv = document.getElementById('cumulativeArray');
        
        if (countingDiv) {
            countingDiv.innerHTML = countArray.map((count, i) => `
                <div class="counting-cell">
                    <span class="counting-label">Index ${i + min}:</span>
                    <span class="counting-value">${count}</span>
                </div>
            `).join('');
        }
        
        if (cumulativeDiv && cumulativeArray) {
            cumulativeDiv.innerHTML = cumulativeArray.map((count, i) => `
                <div class="counting-cell">
                    <span class="counting-label">Index ${i + min}:</span>
                    <span class="counting-value">${count}</span>
                </div>
            `).join('');
        }
    }
    
    async bucketSort() {
        const bucketCount = Math.floor(Math.sqrt(this.array.length));
        const max = Math.max(...this.array);
        const min = Math.min(...this.array);
        const range = max - min;
        const buckets = Array.from({length: bucketCount}, () => []);
        
        this.showSpecialVisualization('Bucket Sort Process', `
            <div class="buckets-container" id="bucketsContainer">
                ${Array.from({length: bucketCount}, (_, i) => `
                    <div class="bucket">
                        <span class="bucket-label">Bucket ${i}:</span>
                        <span class="bucket-content" id="bucket${i}">[]</span>
                    </div>
                `).join('')}
            </div>
        `);
        
        // Distribute elements into buckets
        for (let i = 0; i < this.array.length; i++) {
            await this.waitIfPaused(); // FIXED: Added pause check
            
            const bucketIndex = Math.floor(((this.array[i] - min) / range) * (bucketCount - 1));
            buckets[bucketIndex].push(this.array[i]);
            
            this.comparing = [i];
            this.drawArray();
            
            // Update bucket display
            for (let j = 0; j < bucketCount; j++) {
                const bucketEl = document.getElementById(`bucket${j}`);
                if (bucketEl) {
                    bucketEl.textContent = `[${buckets[j].join(', ')}]`;
                }
            }
            
            await this.sleep();
        }
        
        // Sort individual buckets and concatenate
        let outputIndex = 0;
        for (let i = 0; i < bucketCount; i++) {
            if (buckets[i].length > 0) {
                buckets[i].sort((a, b) => a - b);
                
                for (let j = 0; j < buckets[i].length; j++) {
                    await this.waitIfPaused(); // FIXED: Added pause check
                    
                    this.array[outputIndex] = buckets[i][j];
                    this.swapping = [outputIndex];
                    this.swaps++;
                    this.drawArray();
                    await this.sleep();
                    outputIndex++;
                }
            }
        }
        
        this.comparing = [];
        this.swapping = [];
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});
