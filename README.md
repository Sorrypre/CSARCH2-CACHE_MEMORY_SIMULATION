# Machine 7: Cache Memory Simulation

## Links & Deliverables
* **Live Deployment:** [Insert your live website deployment link here] 
  * *(Note: Ensure this link is also provided in the "About" or "Website" section of your GitHub repository)*
* **Video Walkthrough:** [Insert your YouTube video link here] 
  * *(Note: Must be 5 to 8 minutes, demonstrating correct system functions and covering all test cases)*

---

## 1. System Specifications and Parameters
*As required, here are the full specifications and parameters of the cache simulation system:*

* **Cache Operations Compared:** 4-Way BSA + LRU vs. 4-Way BSA + MRU
* **Main Memory Size:** 1024 blocks (Fixed)[cite: 1]
* **Number of Cache Blocks:** [Insert your value: e.g., 16] (Power of 2, minimum 4)
* **Block Size:** [Insert your value: e.g., 16 words] (Power of 2, minimum 2 words)
* **Read Policy:** [Insert your chosen policy: Non-load-through OR Load-through]

---

## 2. Test Case Analysis
*Below is the detailed analysis of the three test cases.*

### Test Case 1: Sequential Sequence
* **Description:** Access up to 2n cache blocks, and repeat this sequence twice.
* **Analysis:**
  * [Insert your analysis here: Discuss hit/miss rates, memory access time, and overall behavior during this sequence]

### Test Case 2: Mid-repeat Blocks
* **Description:** Start accessing from block 0 up to n - 1, then repeat a sequence up to 2n - 1 twice. Afterwards, reverse the entire sequence pattern.
* **Analysis:**
  * [Insert your analysis here: Discuss hit/miss rates, memory access time, and overall behavior during this sequence]

### Test Case 3: Random Sequence
* **Description:** Generate a random sequence of 64 block accesses where the block indices fall within the 0 to 1023 range.
* **Analysis:**
  * [Insert your analysis here: Discuss hit/miss rates, memory access time, and overall behavior during this sequence]

---

## 3. Operations Comparison: 4-Way BSA + LRU vs. 4-Way BSA + MRU
*This section explicitly compares how the two cache operations performed for this specific machine.*

### Performance Metrics Comparison
| Metric | 4-Way BSA + LRU | 4-Way BSA + MRU |
| :--- | :--- | :--- |
| **Total Memory Access Count** | [Value] | [Value] |
| **Cache Hit Count** | [Value] | [Value] |
| **Cache Miss Count** | [Value] | [Value] |
| **Cache Hit Rate** | [Value]% | [Value]% |
| **Cache Miss Rate** | [Value]% | [Value]% |
| **Average Memory Access Time** | [Value] | [Value] |
| **Total Memory Access Time** | [Value] | [Value] |
*(Note: These metrics correspond to the required Statistical Metrics GUI outputs)*

### Conclusion & Write-up
* [Insert your explicit comparison here: Which algorithm performed better for which test case? Why did LRU outperform MRU (or vice versa) based on the test case patterns?]

---

## Repository Checklist
- [ ] Source Code is complete and well-commented.
- [ ] Screenshots of program output for all possible test cases and specifications are included in the repository.
