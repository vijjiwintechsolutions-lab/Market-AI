import { UniversalHistoryEngine } from '../services/historyEngine';
  import { UniversalAnalyticsEngine } from '../services/analyticsEngine';
  
  // ... inside UniversalToolEngine.tsx

  const handleExecute = async () => {
    setValidationError(null);
    
    // 🛡️ 1. MUTE VALIDATION ENGINE
    const validation = UniversalValidationEngine.validate(tool, inputValues, uploadedFiles);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Validation failed.');
      return;
    }

    setIsRunning(true);
    setTextOutput(null);
    setMediaOutputUrl(null);
    setFileDownloadUrl(null);
    setProgressPercent(0);

    const progressInt = setInterval(() => setProgressPercent(p => (p < 94 ? p + Math.floor(Math.random() * 8) + 2 : p)), 100);
    const start = Date.now();

    try {
      // 🚀 2. MUTE PROCESSING ROUTER
      const res = await apiService.execute({ tool, inputValues, files: uploadedFiles });
      
      clearInterval(progressInt);
      setProgressPercent(100);
      const execTime = Date.now() - start;
      
      setTimeout(() => {
        if (res.success) {
          if (res.textOutput) setTextOutput(res.textOutput);
          if (res.mediaUrl) setMediaOutputUrl(res.mediaUrl);
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          
          // 🕰️ 3. MUTE HISTORY & ANALYTICS (SUCCESS)
          UniversalHistoryEngine.logExecution(tool, 'success', execTime, inputValues);
          UniversalAnalyticsEngine.trackUsage(tool, execTime, true);

        } else {
          setValidationError(res.error || 'Execution failed.');
          
          // 🚨 3. MUTE HISTORY & ANALYTICS (ERROR)
          UniversalHistoryEngine.logExecution(tool, 'error', execTime, inputValues);
          UniversalAnalyticsEngine.trackUsage(tool, execTime, false);
        }
        
        setExecutionTime(res.executionTimeMs || execTime);
        setIsRunning(false);
      }, 400);

    } catch (err: any) {
      clearInterval(progressInt);
      setIsRunning(false);
      setValidationError(err.message || 'An unexpected runtime error occurred.');
      
      const execTime = Date.now() - start;
      UniversalHistoryEngine.logExecution(tool, 'error', execTime, inputValues);
      UniversalAnalyticsEngine.trackUsage(tool, execTime, false);
    }
  };

  const handleDownload = () => {
    const targetUrl = fileDownloadUrl || mediaOutputUrl;
    if (!targetUrl) return;
    
    const activeExt = inputValues['outputFormat'] || tool.outputs[0] || 'out';
    let baseName = tool.id;
    if (uploadedFiles.length > 0) {
      baseName = uploadedFiles[0].name.substring(0, uploadedFiles[0].name.lastIndexOf('.')) || tool.id;
    }
    
    // ⬇️ 4. MUTE DOWNLOAD ENGINE
    UniversalDownloadEngine.download(targetUrl, baseName, activeExt);
    
    // 📊 5. TRACK DOWNLOAD
    UniversalAnalyticsEngine.trackDownload(tool.id, activeExt);
  };
