import { PaperAnalysis } from '../types';

export interface DemoPaperItem {
  id: string;
  title: string;
  field: string;
  shortSummary: string;
  rawText: string;
  analysis: PaperAnalysis;
}

export const DEMO_PAPERS: DemoPaperItem[] = [
  {
    id: 'traffic-gnn',
    title: 'Adaptive Dynamic Graph Convolutional Recurrent Network (AD-GCRN) for Multi-Step Urban Metro Congestion Forecasting',
    field: 'Intelligent Transportation & Graph Neural Networks',
    shortSummary: 'Dynamically infers passenger transfer networks without relying solely on static railway tracks.',
    rawText: `Adaptive Dynamic Graph Convolutional Recurrent Network (AD-GCRN) for Multi-Step Urban Metro Congestion Forecasting
Authors: Rajesh Varma, Elena Kowalski, Jin-Woo Park
Journal: IEEE Transactions on Intelligent Transportation Systems (Preprint 2025)

ABSTRACT
Accurate multi-step passenger flow forecasting in metropolitan rail transit networks is pivotal for proactive crowd management and transit dispatching. Existing spatio-temporal graph convolutional networks (STGCNs) predominantly rely on predefined, static adjacency matrices derived strictly from physical track connectivity or geographical Euclidean distances. However, physical railway topologies fail to capture dynamic origin-destination passenger transfer flows, route reassignments during localized service disruptions, or evolving time-of-day travel affinities. In this paper, we propose the Adaptive Dynamic Graph Convolutional Recurrent Network (AD-GCRN). AD-GCRN adaptively learns a time-varying spatial-temporal graph adjacency matrix directly from historical passenger tap-in/tap-out smart-card transactions without requiring prior geographic topology matrices. We couple this adaptive adjacency generator with a two-layer Gated Recurrent Unit (GRU) to capture nonlinear temporal dynamics across 15-minute, 30-minute, and 60-minute prediction horizons. Extensive experiments conducted on two real-world multi-million passenger benchmarks—Shenzhen Metro (SZ-Metro, 284 stations) and Shanghai Metro (SH-Metro, 413 stations)—demonstrate that AD-GCRN outperforms state-of-the-art baselines. Specifically, for 60-minute horizon forecasting on SZ-Metro, AD-GCRN achieves a Mean Absolute Error (MAE) of 18.42 passengers/min and Root Mean Squared Error (RMSE) of 28.11 passengers/min, outperforming DCRNN by 11.3% and STGCN by 7.8%.

1. METHODOLOGY & ARCHITECTURE
Given a transit network of N stations observed over T historical time slices with C flow channels (inflow and outflow), the input is represented as tensor X in R^{N x T x C}.
To overcome the limitations of static graph Laplacians, we construct parameterized station spatial embedding E_s in R^{N x d} and a temporal hidden feature state E_t in R^{d x N} derived from sequence representations. The adaptive dynamic adjacency matrix A_t is computed at each time step via:
A_t = Softmax(ReLU(E_s * E_t^T))
This dynamic adjacency matrix is plugged directly into a Chebyshev graph convolutional operator:
Z_t = sum_{k=0}^{K-1} T_k(A_t) * X_t * W_k
The spatial features Z_t are subsequently propagated through a 2-layer Gated Recurrent Unit (GRU) encoder-decoder architecture with hidden dimension d_h = 64. Training is executed end-to-end minimizing the Mean Absolute Error (MAE) with AdamW optimizer (learning rate 0.001, weight decay 1e-4) over 120 epochs on 4x NVIDIA A100 GPUs.

2. EXPERIMENTAL EVALUATION & RESULTS
Datasets:
- SZ-Metro: 284 stations, 3 consecutive months of smart-card tap transaction records (approx. 4.2 million trips daily).
- SH-Metro: 413 stations, 2 consecutive months of tap records.
Evaluation Metrics: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Mean Absolute Percentage Error (MAPE).

Benchmark Performance on SZ-Metro (60-Minute Ahead Prediction):
- Historical Average (HA): MAE 27.60, RMSE 41.20
- Vector Auto-Regression (VAR): MAE 24.12, RMSE 36.85
- DCRNN (Li et al., 2018): MAE 20.76, RMSE 31.90
- STGCN (Yu et al., 2018): MAE 19.98, RMSE 30.45
- Graph WaveNet (Wu et al., 2019): MAE 19.12, RMSE 29.30
- Proposed AD-GCRN: MAE 18.42, RMSE 28.11 (p < 0.01 vs Graph WaveNet under paired t-test)

Ablation Studies:
Removing the dynamic temporal embedding component and relying solely on a learned static matrix (A_static = Softmax(ReLU(E_s * E_s^T))) degrades the 60-min MAE from 18.42 to 22.15 (an error inflation of 20.2%), confirming that static adjacency cannot model sudden peak-hour transfer surges.

3. LIMITATIONS & THREATS TO VALIDITY
The authors explicitly acknowledge three core limitations:
1. Severe weather conditions (e.g., tropical typhoons, torrential rainfall) and external urban events (e.g., stadium concerts, major exhibitions) were not integrated into the feature pipeline due to lack of synchronized municipal weather and ticketing APIs.
2. The dynamic matrix calculation introduces O(N^2) complexity per time step, leading to substantial memory consumption during training on large metro networks exceeding 500 stations.
3. Cold-start station forecasting for newly inaugurated stations without at least 14 days of smart-card tap history remains an unaddressed failure mode.`,
    analysis: {
      isDemo: true,
      paperMeta: {
        title: 'Adaptive Dynamic Graph Convolutional Recurrent Network (AD-GCRN) for Multi-Step Urban Metro Congestion Forecasting',
        authors: 'Rajesh Varma, Elena Kowalski, Jin-Woo Park',
        year: '2025',
        field: 'Intelligent Transportation & Graph Neural Networks',
        doiOrSource: 'IEEE Transactions on Intelligent Transportation Systems (Preprint 2025)',
        readingTimeMinutes: 14,
      },
      overview: {
        plainLanguageSummary: 'This research paper introduces a dynamic graph neural network (AD-GCRN) that forecasts passenger crowding across metropolitan subway stations up to 60 minutes into the future. Instead of assuming passengers only interact along fixed train tracks, the model learns live travel connections directly from smart-card tap transactions, reducing crowd prediction errors by over 11% compared to traditional baselines.',
        coreProblem: 'Traditional transit prediction systems model transit maps as static physical train tracks, which fail to capture rapid crowd re-routing, sudden station transfers, and rush-hour bottleneck propagation.',
        keyContribution: 'Formulation of an adaptive dynamic adjacency matrix generator A_t = Softmax(ReLU(E_s * E_t^T)) that continuously computes dynamic passenger affinity graphs without relying on static track maps.',
        keyFindings: [
          'AD-GCRN achieves 18.42 MAE and 28.11 RMSE on Shenzhen Metro at the 60-minute prediction horizon.',
          'Statistically significant error reduction (p < 0.01 paired t-test) compared to Graph WaveNet and STGCN.',
          'Ablation of dynamic adjacency matrix causes a 20.2% increase in prediction error (MAE degrades to 22.15).',
        ],
        practicalRelevance: 'Allows municipal subway authorities to deploy preventive crowd metering and platform dispatch warnings 30 to 60 minutes before severe rush-hour station overcrowding occurs.',
        publicationReadiness: {
          rigorScore: 'High Empirical Rigor',
          reproducibilityStatus: 'Partially Reproducible (Datasets cited; code release not stated in paper)',
          statisticalReporting: 'Paired t-test reported (p < 0.01); confidence intervals not displayed.',
        },
      },
      methods: {
        methodologicalBreakdown: 'The methodology transforms continuous smart-card tap-in/out records into multi-channel spatiotemporal tensors. Spatial and temporal node embeddings are continuously multiplied to produce a dynamic, time-varying adjacency matrix. This matrix feeds into a Chebyshev graph convolution, whose outputs are temporally aggregated across time steps through a 2-layer Gated Recurrent Unit (GRU) encoder-decoder.',
        datasetsAndBenchmarks: [
          {
            name: 'SZ-Metro (Shenzhen)',
            sampleCount: '284 stations, 3 consecutive months, ~4.2M daily trips',
            description: 'Smart-card tap-in and tap-out transaction events aggregated into 15-minute intervals.',
            accessType: 'Municipal Open Research Release',
          },
          {
            name: 'SH-Metro (Shanghai)',
            sampleCount: '413 stations, 2 consecutive months',
            description: 'Large-scale multi-line transfer transit network with dense interchange hubs.',
            accessType: 'Academic Benchmark',
          },
        ],
        architectureAndAlgorithms: [
          'Dynamic Adjacency Generator: Softmax(ReLU(E_s * E_t^T))',
          'Chebyshev Polynomial Graph Convolution (K-order hops)',
          '2-Layer Gated Recurrent Unit (GRU) with hidden dimension 64',
          'AdamW Optimizer (lr=0.001, weight decay=1e-4, 120 epochs)',
          'End-to-End Mean Absolute Error (MAE) loss optimization',
        ],
        mathematicalFormulation: 'Input tensor X ∈ R^{N × T × C}. Dynamic matrix A_t = Softmax(ReLU(E_s · E_t^T)). Graph filtering Z_t = ∑_{k=0}^{K-1} T_k(A_t) X_t W_k. Recurrent cell: h_t = GRU(Z_t, h_{t-1}). Objective function: L = (1/N·T) ∑ |Y - Y_pred|.',
        pipelineSteps: [
          {
            stepNumber: 1,
            title: 'Smart-Card Stream Binning',
            description: 'Raw turnstile tap transactions are binned into 15-minute inflow and outflow counts per station.',
            inputOutput: 'Raw Transaction Logs -> Spatio-Temporal Tensor (N x T x 2)',
          },
          {
            stepNumber: 2,
            title: 'Dynamic Adjacency Inference',
            description: 'Computes dot-product affinity between spatial station embedding E_s and temporal hidden state E_t.',
            inputOutput: 'Embeddings (N x d, d x N) -> Dynamic Adjacency Matrix A_t (N x N)',
          },
          {
            stepNumber: 3,
            title: 'Chebyshev Graph Convolution',
            description: 'Executes localized spectral graph filtering over dynamic neighborhood connections.',
            inputOutput: 'A_t and Flow Tensor -> Spatial Feature Tensor Z_t (N x d_conv)',
          },
          {
            stepNumber: 4,
            title: '2-Layer GRU Recurrent Encoding',
            description: 'Captures sequential temporal dependencies across historical 12 time slices (3 hours).',
            inputOutput: 'Z_t Sequence -> Hidden State Memory H (N x 64)',
          },
          {
            stepNumber: 5,
            title: 'Multi-Horizon Prediction Head',
            description: 'Linear projection decodes forecasts for 15, 30, and 60 minutes into the future.',
            inputOutput: 'Hidden Memory H -> Multi-Step Forecasts (N x 4 x 2)',
          },
        ],
      },
      results: {
        supportedFindings: [
          {
            metric: '60-Min Horizon MAE (SZ-Metro)',
            datasetOrCondition: 'Shenzhen Metro 284 Stations',
            score: '18.42 passengers/min',
            baselineComparison: 'Outperforms DCRNN (20.76) by 11.3% and Graph WaveNet (19.12) by 3.7%',
            quoteEvidence: 'AD-GCRN achieves a Mean Absolute Error (MAE) of 18.42 passengers/min... outperforming DCRNN by 11.3%',
          },
          {
            metric: '60-Min Horizon RMSE (SZ-Metro)',
            datasetOrCondition: 'Shenzhen Metro 284 Stations',
            score: '28.11 passengers/min',
            baselineComparison: 'Outperforms Historical Average (41.20) and STGCN (30.45)',
            quoteEvidence: 'Root Mean Squared Error (RMSE) of 28.11 passengers/min, outperforming DCRNN by 11.3% and STGCN by 7.8%',
          },
          {
            metric: 'Ablation Error Surge (Static Matrix)',
            datasetOrCondition: 'Without dynamic temporal embeddings',
            score: '22.15 MAE (+20.2% error)',
            baselineComparison: 'Static matrix error rises from 18.42 to 22.15',
            quoteEvidence: 'relying solely on a learned static matrix degrades the 60-min MAE from 18.42 to 22.15',
          },
        ],
        statisticalSignificance: 'Paired t-test reported with p < 0.01 versus Graph WaveNet baseline. Standard deviation across multiple random seeds is [NOT REPORTED IN PAPER].',
        benchmarkSummary: 'Demonstrated consistent superiority over 5 competitive time-series baselines (HA, VAR, DCRNN, STGCN, Graph WaveNet) across both SZ-Metro and SH-Metro datasets.',
        ablationStudyFindings: 'Dynamic adjacency generator verified as the single most critical architectural component; removing dynamic embeddings increases forecast error by 20.2%.',
        authorQuotes: [
          {
            claim: 'Dynamic passenger flows diverge from static railway tracks',
            verbatimQuote: 'physical railway topologies fail to capture dynamic origin-destination passenger transfer flows, route reassignments during localized service disruptions, or evolving time-of-day travel affinities.',
            sectionOrPage: 'Section 1 (Abstract & Introduction)',
          },
          {
            claim: 'Dynamic matrix calculation overhead',
            verbatimQuote: 'The dynamic matrix calculation introduces O(N^2) complexity per time step, leading to substantial memory consumption during training on large metro networks exceeding 500 stations.',
            sectionOrPage: 'Section 3 (Limitations)',
          },
        ],
      },
      researchGaps: {
        statedLimitations: [
          'Exclusion of meteorological variables (typhoons, rainfall) and municipal event calendars due to lack of synchronized feeds.',
          'Quadratic O(N^2) spatial memory complexity per time step limits direct scalability to systems above 500 stations.',
          'Inability to accurately forecast newly opened stations with fewer than 14 days of smart-card history (cold-start dilemma).',
        ],
        unaddressedQuestions: [
          'How does the model react to sudden unplanned track disruptions or emergency line evacuations when historical passenger tap distributions no longer apply?',
          'Could multi-modal transit transfers (e.g. bus feeder lines, bike share pickups) be integrated into the dynamic adjacency graph?',
        ],
        assumptionsAndBiases: [
          'Assumes passenger smart-card taps correlate linearly with platform crowding, neglecting fare-evasion or tap-out latency delays.',
          'Assumes station passenger demand patterns remain stationary across seasonal transitions (e.g., summer break vs. school semester).',
        ],
        threatsToValidity: [
          'Construct validity risk: Evaluation focuses solely on aggregate station counts rather than individual route transfer delays.',
          'External validity risk: Evaluated only on Chinese megacity transit networks; applicability to dispersed Western transit systems with flat ticket fares is unverified.',
        ],
        missingSourceSections: [
          'Open-source code repository or reproducibility link is [NOT REPORTED IN PAPER].',
          'Exact GPU memory consumption in gigabytes during training is [NOT REPORTED IN PAPER].',
          'Ablation analysis on GRU layer count vs Transformer self-attention alternative is [NOT REPORTED IN PAPER].',
        ],
      },
      projectIdeas: [
        {
          id: 'proj-1',
          title: 'Lightweight PyTorch Geometric Implementation on Open Mini-Transit Graph',
          difficulty: 'Beginner',
          durationWeeks: '3-4 weeks',
          problemStatement: 'Replicate the AD-GCRN dynamic adjacency generation mechanism on a manageable 20-station open synthetic transit dataset to understand dynamic matrix learning.',
          prerequisiteStack: ['Python', 'PyTorch Geometric', 'Pandas', 'Matplotlib'],
          implementationPlan: [
            {
              phase: 'Data Pipeline & Synthetic Graph',
              description: 'Construct a 20-node synthetic subway grid with periodic sinusoidal peak hours and random delay shocks.',
              weekRange: 'Week 1',
            },
            {
              phase: 'Dynamic Matrix Module',
              description: 'Implement the Softmax(ReLU(E_s * E_t^T)) dynamic adjacency layer and verify gradient flow.',
              weekRange: 'Week 2',
            },
            {
              phase: 'Model Training & Baseline Comparison',
              description: 'Train AD-GCRN alongside a simple static GCN and plot heatmaps comparing learned adjacency vs physical track lines.',
              weekRange: 'Week 3-4',
            },
          ],
          expectedOutcome: 'A reproducible GitHub repository with Jupyter notebooks demonstrating how dynamic adjacency learns commuter flow patterns.',
          potentialPitfalls: 'Overfitting on small graphs; requires dropout regularization on the learned spatial embeddings.',
        },
        {
          id: 'proj-2',
          title: 'Multi-Modal Weather & Event Fusion via Gated Cross-Attention',
          difficulty: 'Intermediate',
          durationWeeks: '6-8 weeks',
          problemStatement: 'Address the primary limitation of AD-GCRN by infusing hourly municipal precipitation data and city event schedules through a cross-attention fusion gate.',
          prerequisiteStack: ['PyTorch', 'HuggingFace Accelerate', 'Open-Meteo API', 'GeoPandas'],
          implementationPlan: [
            {
              phase: 'Multi-Modal Data Harvesting',
              description: 'Align public subway turnstile data (e.g. NYC MTA or London TfL open data) with Open-Meteo hourly rainfall and stadium event dates.',
              weekRange: 'Weeks 1-2',
            },
            {
              phase: 'Weather Gating Mechanism',
              description: 'Design a cross-attention layer that modulates the station temporal embeddings E_t based on precipitation intensity.',
              weekRange: 'Weeks 3-4',
            },
            {
              phase: 'Ablation & Extreme Weather Stress-Testing',
              description: 'Evaluate model MAE during high-rainfall storm days versus clear-weather baselines.',
              weekRange: 'Weeks 5-8',
            },
          ],
          expectedOutcome: 'An extended architecture showing measurable prediction resilience during inclement weather, closing a major real-world transit gap.',
          potentialPitfalls: 'Sparse rainfall events may cause the weather attention gate to collapse to zero without loss re-weighting.',
        },
        {
          id: 'proj-3',
          title: 'Sparse Linear-Complexity Dynamic Graph Attention for 1,000+ Station Scaling',
          difficulty: 'Advanced',
          durationWeeks: '10-12 weeks',
          problemStatement: 'Overcome the quadratic O(N^2) memory bottleneck of AD-GCRN by designing a Top-K sparse or Performer/Kernelized dynamic adjacency formulation.',
          prerequisiteStack: ['PyTorch CUDA Extensions', 'Triton', 'Distributed PyTorch', 'Graph Attention Networks'],
          implementationPlan: [
            {
              phase: 'Mathematical Reformulation',
              description: 'Formulate a Top-K dynamic routing scheme or random feature map approximation of Softmax(ReLU(E_s * E_t^T)).',
              weekRange: 'Weeks 1-3',
            },
            {
              phase: 'Custom CUDA/Triton Kernel Implementation',
              description: 'Implement memory-efficient sparse dynamic matrix multiplication avoiding full N x N dense tensor instantiation.',
              weekRange: 'Weeks 4-7',
            },
            {
              phase: 'National-Scale Transit Benchmarking',
              description: 'Benchmark on national rail network graphs (>1,500 stations) profiling peak VRAM usage and inference frames per second.',
              weekRange: 'Weeks 8-12',
            },
          ],
          expectedOutcome: 'An enterprise-scale sparse transit GNN running within 8GB VRAM on consumer GPUs while maintaining sub-20 MAE.',
          potentialPitfalls: 'Top-K selection may suffer non-differentiable indexing; use Gumbel-Softmax or continuous relaxation.',
        },
      ],
      architectureDiagram: {
        mermaidGraph: `graph TD
  Tap["Smart-Card Tap Streams (SZ/SH Metro)"] --> Feat["Station Flow Tensor (N x T x C)"]
  Feat --> EmbS["Station Spatial Embeddings E_s"]
  Feat --> EmbT["Temporal Hidden State E_t"]
  EmbS --> DynamicAdj["Adaptive Matrix Generator: Softmax(ReLU(E_s * E_t^T))"]
  EmbT --> DynamicAdj
  DynamicAdj --> GCN["Chebyshev Graph Convolutional Unit"]
  Feat --> GCN
  GCN --> GRU["2-Layer Gated Recurrent Unit (hidden: 64)"]
  GRU --> MultiStep["Multi-Horizon Decoder (15/30/60 min)"]
  MultiStep --> Pred["Passenger Inflow & Outflow Forecasts"]`,
        diagramExplanation: 'Data flows from raw smart-card turnstiles into a spatio-temporal tensor. Parallel pathways compute spatial station embeddings and temporal hidden states. These embeddings interact through dot products to generate dynamic adjacency matrix A_t, which guides Chebyshev graph convolutions before entering a 2-layer GRU sequence decoder for multi-step forecasts.',
      },
      rawTextExcerpt: `Adaptive Dynamic Graph Convolutional Recurrent Network (AD-GCRN) for Multi-Step Urban Metro Congestion Forecasting (Varma, Kowalski, Park - 2025). Evaluated on Shenzhen (284 stations) and Shanghai (413 stations). 60-min MAE: 18.42 vs DCRNN 20.76. Dynamic adjacency matrix A_t = Softmax(ReLU(E_s * E_t^T)).`,
    },
  },
  {
    id: 'leaf-disease-cnn',
    title: 'Dual-Branch Spatial-Channel Residual Network for Real-Time Tomato Leaf Late Blight Phenotyping',
    field: 'Precision Agriculture & Computer Vision',
    shortSummary: 'Dual-stream residual CNN separating fine lesion edge detection from symptom channel attention.',
    rawText: `Dual-Branch Spatial-Channel Residual Network for Real-Time Tomato Leaf Late Blight Phenotyping
Authors: Wei Chen, Linda Zhao, Marco Bellini
Journal: Computers and Electronics in Agriculture (Preprint 2024)

ABSTRACT
Early and accurate phenotyping of Phytophthora infestans (late blight) on tomato foliage is crucial for targeted pesticide minimization and harvest security. While existing deep convolutional architectures report near-perfect accuracy (>98%) on benchmark laboratory datasets, their diagnostic precision plummets when deployed on low-power edge devices under real-world agricultural conditions characterized by complex soil backdrops, sunlight glare, and fluctuating leaf moisture. In this work, we propose DB-ResNet, a dual-branch lightweight residual network designed for real-time foliar diagnostics on edge agricultural drones. DB-ResNet bifurcates the visual representation pipeline into a 24-layer spatial residual branch (capturing microscopic necrotic margins) and a squeeze-and-excitation channel attention branch (identifying spectral pigmentation signatures). Evaluated on the benchmark PlantVillage dataset (18,160 leaf images, 10 disease categories) and an independent in-field dataset collected via handheld RGB cameras across 12 tomato greenhouses in Shandong Province (2,400 images), DB-ResNet achieved 98.42% accuracy on PlantVillage and 89.15% accuracy on the challenging in-field dataset. When deployed on an NVIDIA Jetson Orin Nano (15W power profile), DB-ResNet operated at an inference latency of 14.2 milliseconds per frame (70.4 FPS).

1. SYSTEM DESIGN & ARCHITECTURE
Given an input RGB crop I in R^{224 x 224 x 3}, images undergo initial bilateral edge-preserving filtering to suppress specular droplet highlights. The representation is then split across two parallel streams:
1. Spatial Residual Branch: 24 residual bottleneck layers with dilated 3x3 convolutions preserving high-resolution feature maps without aggressive stride pooling.
2. Channel Squeeze-and-Excitation Branch: Global average pooling collapses spatial dimensions into channel descriptors, passed through two dense layers with ReLU and Sigmoid activations to learn inter-channel weightings.
The resulting feature maps are concatenated and passed to a linear classification head optimized using Focal Loss (gamma = 2.0, alpha = 0.25) to combat severe class imbalance in early-stage lesions.

2. EXPERIMENTAL BENCHMARKS
- PlantVillage Test Set: DB-ResNet achieved 98.42% top-1 accuracy, surpassing MobileNetV3 (94.10%), ResNet-50 (96.80%), and Vision Transformer ViT-B/16 (97.10%).
- Field Test Set (Shandong Greenhouse): DB-ResNet achieved 89.15% accuracy. MobileNetV3 degraded to 79.40%, and ResNet-50 degraded to 81.60%.
- Latency on NVIDIA Jetson Orin Nano: 14.2 ms / frame with INT8 TensorRT quantization.
- Ablation: Eliminating the spatial branch reduced overall accuracy by 5.3% on blurry field images.

3. LIMITATIONS
1. Diagnostic accuracy drops by 9.27% when transitioning from controlled laboratory leaves to greenhouse environments with variable sun glare.
2. The dataset did not assess asymptomatic pre-symptomatic fungal incubation periods (first 48-72 hours post-inoculation).
3. The model was validated strictly on Solanum lycopersicum (tomato) and did not include cross-species transfer tests on Solanum tuberosum (potato late blight).`,
    analysis: {
      isDemo: true,
      paperMeta: {
        title: 'Dual-Branch Spatial-Channel Residual Network for Real-Time Tomato Leaf Late Blight Phenotyping',
        authors: 'Wei Chen, Linda Zhao, Marco Bellini',
        year: '2024',
        field: 'Precision Agriculture & Computer Vision',
        doiOrSource: 'Computers and Electronics in Agriculture (Preprint 2024)',
        readingTimeMinutes: 11,
      },
      overview: {
        plainLanguageSummary: 'This study develops an edge-deployable computer vision model (DB-ResNet) to detect tomato late blight disease from leaf images in greenhouse farming. By separating fine leaf edge details from color symptom patterns, it runs at over 70 frames per second on miniature edge computers, achieving 98.4% lab accuracy and 89.2% in harsh greenhouse conditions.',
        coreProblem: 'Standard vision models trained on clean laboratory leaves suffer severe performance drops in real farming environments with soil clutter, leaf glare, and limited drone compute.',
        keyContribution: 'A dual-branch architecture combining a 24-layer spatial residual stream with a channel squeeze-and-excitation attention module optimized with Focal Loss for edge devices.',
        keyFindings: [
          'DB-ResNet achieves 98.42% accuracy on the PlantVillage benchmark and 89.15% on in-field greenhouse leaves.',
          'Runs at 14.2ms latency (70.4 FPS) on an NVIDIA Jetson Orin Nano under a 15W power constraint.',
          'Ablation demonstrates that the spatial residual branch is essential for outdoor leaves, preventing a 5.3% accuracy drop.',
        ],
        practicalRelevance: 'Enables autonomous agricultural drones and handheld scouting cameras to identify foliar blight in real time before widespread crop devastation occurs.',
        publicationReadiness: {
          rigorScore: 'High Empirical Rigor',
          reproducibilityStatus: 'Partially Reproducible (Datasets cited; code availability on request)',
          statisticalReporting: 'Ablation study reported; p-values and 95% confidence intervals are [NOT REPORTED IN PAPER].',
        },
      },
      methods: {
        methodologicalBreakdown: 'Input leaf photos are processed with edge-preserving bilateral filtering, then bifurcated into a 24-layer dilated spatial residual stream and an SE channel-attention stream. Feature maps are fused and classified with a Focal Loss objective to address sparse early-stage lesions.',
        datasetsAndBenchmarks: [
          {
            name: 'PlantVillage Benchmark',
            sampleCount: '18,160 leaf images, 10 categories',
            description: 'Laboratory-controlled dataset with uniform grey/black backgrounds.',
            accessType: 'Open Public Academic Dataset',
          },
          {
            name: 'Shandong Greenhouse Field Dataset',
            sampleCount: '2,400 images from 12 commercial greenhouses',
            description: 'Captured with handheld RGB cameras under natural sunlight, shadows, and soil backdrops.',
            accessType: 'Private Author Collection',
          },
        ],
        architectureAndAlgorithms: [
          'Spatial Residual Stream: 24 bottleneck layers with dilated 3x3 convolutions',
          'Channel Attention: Squeeze-and-Excitation (SE) block with global average pooling',
          'Loss Function: Focal Loss (gamma = 2.0, alpha = 0.25)',
          'Quantization: INT8 TensorRT deployment on NVIDIA Jetson Orin Nano (15W)',
        ],
        mathematicalFormulation: 'Input I ∈ R^{224 × 224 × 3}. Focal Loss: FL(p_t) = -alpha_t (1 - p_t)^gamma log(p_t). Squeeze-and-Excitation: s = Sigmoid(W_2 · ReLU(W_1 · GAP(F))).',
        pipelineSteps: [
          {
            stepNumber: 1,
            title: 'Bilateral Edge-Preserving Filter',
            description: 'Suppresses specular sunlight glare while retaining sharp lesion boundary transitions.',
            inputOutput: 'Raw RGB Photo -> Filtered Image (224 x 224 x 3)',
          },
          {
            stepNumber: 2,
            title: 'Stream Bifurcation',
            description: 'Directs the filtered tensor simultaneously to spatial and channel branches.',
            inputOutput: 'Filtered Image -> Dual Stream Inputs',
          },
          {
            stepNumber: 3,
            title: 'Spatial Residual Extraction',
            description: 'Extracts microscopic lesion textures across 24 dilated residual layers.',
            inputOutput: 'Input Tensor -> Spatial Feature Maps (28 x 28 x 256)',
          },
          {
            stepNumber: 4,
            title: 'Channel Squeeze-and-Excitation',
            description: 'Computes inter-channel importance weights to highlight chlorophyll discoloration.',
            inputOutput: 'Input Tensor -> Channel Attention Weights (1 x 1 x 256)',
          },
          {
            stepNumber: 5,
            title: 'Feature Fusion & Classification',
            description: 'Fuses spatial and channel representations before passing to a 10-class diagnostic head.',
            inputOutput: 'Fused Features -> Disease Classification Probabilities',
          },
        ],
      },
      results: {
        supportedFindings: [
          {
            metric: 'PlantVillage Lab Accuracy',
            datasetOrCondition: '18,160 laboratory images',
            score: '98.42% Top-1 Accuracy',
            baselineComparison: 'Outperforms MobileNetV3 (94.10%) and ResNet-50 (96.80%)',
            quoteEvidence: 'DB-ResNet achieved 98.42% accuracy on PlantVillage... outperforming MobileNetV3 (94.1%) and ResNet-50 (96.8%)',
          },
          {
            metric: 'In-Field Greenhouse Accuracy',
            datasetOrCondition: '2,400 Shandong greenhouse images',
            score: '89.15% Accuracy',
            baselineComparison: 'Maintains superiority over MobileNetV3 (79.40%) and ResNet-50 (81.60%)',
            quoteEvidence: 'On the in-field dataset under variable lighting, accuracy degraded to 89.15%',
          },
          {
            metric: 'Inference Latency',
            datasetOrCondition: 'NVIDIA Jetson Orin Nano (15W INT8)',
            score: '14.2 milliseconds / frame (70.4 FPS)',
            baselineComparison: 'Sufficient for 60+ FPS real-time drone video processing',
            quoteEvidence: 'Inference latency was 14.2ms on an NVIDIA Jetson Orin Nano',
          },
        ],
        statisticalSignificance: 'P-values and confidence intervals are [NOT REPORTED IN PAPER].',
        benchmarkSummary: 'Demonstrates clear edge latency and accuracy advantages over larger models (ResNet-50, ViT-B/16) in edge deployment scenarios.',
        ablationStudyFindings: 'Removing the spatial branch caused a 5.3% degradation in field image accuracy, validating the dual-branch hypothesis.',
        authorQuotes: [
          {
            claim: 'Lab-to-field performance drop',
            verbatimQuote: 'While existing deep convolutional architectures report near-perfect accuracy (>98%) on benchmark laboratory datasets, their diagnostic precision plummets when deployed on low-power edge devices under real-world agricultural conditions',
            sectionOrPage: 'Section 1 (Abstract)',
          },
          {
            claim: 'Pre-symptomatic blind spot',
            verbatimQuote: 'The dataset did not assess asymptomatic pre-symptomatic fungal incubation periods (first 48-72 hours post-inoculation).',
            sectionOrPage: 'Section 3 (Limitations)',
          },
        ],
      },
      researchGaps: {
        statedLimitations: [
          'A 9.27% accuracy decline occurs when shifting from lab images to greenhouse environments.',
          'Inability to detect pre-symptomatic infection during the first 48 to 72 hours of pathogen incubation.',
          'Evaluation restricted to tomato leaves; cross-species transfer to potato foliage unverified.',
        ],
        unaddressedQuestions: [
          'How does the model handle multi-pathogen co-infections (e.g. early blight and late blight on the same foliage)?',
          'What is the battery drain and thermal throttling behavior on a flying agricultural drone during continuous 30-minute missions?',
        ],
        assumptionsAndBiases: [
          'Assumes camera sensor captures clear focus at minimum flight distances of 30-50 cm without propeller wind blur.',
          'Assumes greenhouse cultivar leaf morphology is representative of outdoor field cultivars.',
        ],
        threatsToValidity: [
          'External validity risk: The 2,400 field images were gathered in one province (Shandong); varied microclimates may exhibit different visual symptoms.',
        ],
        missingSourceSections: [
          'Public GitHub repository link is [NOT REPORTED IN PAPER; marked available upon request].',
          'Confusion matrix breakdown across all 10 individual classes is [NOT REPORTED IN PAPER].',
          'Model size in Megabytes and parameter count are [NOT REPORTED IN PAPER].',
        ],
      },
      projectIdeas: [
        {
          id: 'leaf-proj-1',
          title: 'Cross-Species Transfer to Potato Late Blight with PyTorch Lightning',
          difficulty: 'Beginner',
          durationWeeks: '3-4 weeks',
          problemStatement: 'Evaluate zero-shot and fine-tuned transferability of DB-ResNet from tomato late blight to potato leaf late blight datasets.',
          prerequisiteStack: ['Python', 'PyTorch', 'Torchvision', 'Scikit-learn'],
          implementationPlan: [
            {
              phase: 'Dataset Preparation',
              description: 'Download open potato leaf blight subsets from Kaggle and PlantVillage.',
              weekRange: 'Week 1',
            },
            {
              phase: 'Transfer Fine-Tuning',
              description: 'Freeze the spatial backbone and fine-tune only the classification head on potato leaves.',
              weekRange: 'Week 2',
            },
            {
              phase: 'Cross-Domain Evaluation',
              description: 'Compute transfer retention rates and confusion matrices.',
              weekRange: 'Weeks 3-4',
            },
          ],
          expectedOutcome: 'A validated cross-species diagnostic benchmark demonstrating whether tomato models generalize to potato crops.',
          potentialPitfalls: 'Potato leaf vein structure is distinct; full-backbone fine-tuning with low learning rate may be required.',
        },
        {
          id: 'leaf-proj-2',
          title: 'Adversarial Glare & Shadow Augmentation Pipeline',
          difficulty: 'Intermediate',
          durationWeeks: '5-6 weeks',
          problemStatement: 'Close the 9.27% greenhouse accuracy gap by training a physics-informed shadow, sun glare, and dust augmentation generator.',
          prerequisiteStack: ['PyTorch', 'Albumentations', 'OpenCV', 'Optuna'],
          implementationPlan: [
            {
              phase: 'Synthetic Glare Modeler',
              description: 'Implement ray-tracing or caustic highlight simulator overlaid on clean lab images.',
              weekRange: 'Weeks 1-2',
            },
            {
              phase: 'Adversarial Augmentation Training',
              description: 'Train DB-ResNet with automated severe lighting transforms.',
              weekRange: 'Weeks 3-4',
            },
            {
              phase: 'Greenhouse Benchmarking',
              description: 'Measure accuracy gains on challenging outdoor greenhouse test splits.',
              weekRange: 'Weeks 5-6',
            },
          ],
          expectedOutcome: 'Demonstrated improvement in outdoor field accuracy from 89.15% to >94%.',
          potentialPitfalls: 'Over-augmenting can destroy subtle lesion boundary pixels; must preserve necrotic boundary contrast.',
        },
        {
          id: 'leaf-proj-3',
          title: 'Temporal Lesion Growth Tracking via Siamese Spatio-Temporal Autoencoders',
          difficulty: 'Advanced',
          durationWeeks: '8-10 weeks',
          problemStatement: 'Track lesion perimeter growth rate across daily time-lapse images to estimate pathogen virulence before macroscopic necrosis spreads.',
          prerequisiteStack: ['PyTorch', 'TIMM', 'Segmentation Models PyTorch', 'CUDA'],
          implementationPlan: [
            {
              phase: 'Time-Lapse Alignment',
              description: 'Register consecutive day leaf images using homography transformation and landmark matching.',
              weekRange: 'Weeks 1-3',
            },
            {
              phase: 'Spatio-Temporal Delta Siamese Network',
              description: 'Design a dual-input Siamese backbone computing lesion expansion vectors.',
              weekRange: 'Weeks 4-6',
            },
            {
              phase: 'Growth Forecasting Head',
              description: 'Predict next-48-hour necrotic spread zone and evaluate against ground truth time-lapses.',
              weekRange: 'Weeks 7-10',
            },
          ],
          expectedOutcome: 'A predictive disease velocity estimation tool enabling early chemical treatment.',
          potentialPitfalls: 'Leaf movement and curling between days makes geometric alignment difficult without non-rigid registration.',
        },
      ],
      architectureDiagram: {
        mermaidGraph: `graph TD
  In["Input RGB Leaf Image (224x224x3)"] --> Pre["Bilateral Edge-Preserving Filter"]
  Pre --> Split["Stream Splitter"]
  Split --> Spatial["Spatial Residual Branch (24 Dilated Layers)"]
  Split --> Channel["Channel Squeeze-and-Excitation Branch"]
  Spatial --> Cat["Feature Map Fusion & Concatenation"]
  Channel --> Cat
  Cat --> Pool["Global Average Pooling"]
  Pool --> Dense["Classification Head with Focal Loss"]
  Dense --> Out["Late Blight Phenotype & Severity Score"]`,
        diagramExplanation: 'Input leaf images undergo bilateral filtering to reduce glare while preserving edge sharpness. The representation branches into a 24-layer spatial residual stream (for lesion margins) and an SE channel-attention stream (for pigment changes). Features are concatenated and classified using Focal Loss to handle class imbalance.',
      },
      rawTextExcerpt: `Dual-Branch Spatial-Channel Residual Network for Real-Time Tomato Leaf Late Blight Phenotyping (Chen, Zhao, Bellini - 2024). Evaluated on PlantVillage (98.42%) and 2,400 Shandong greenhouse field images (89.15%). NVIDIA Jetson Orin Nano latency: 14.2ms.`,
    },
  },
];
