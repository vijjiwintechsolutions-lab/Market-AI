{/* GENERATED OUTPUT & LIVE PREVIEW (RIGHT) */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                {uploadedFile && !outputResult && !imageUrlResult ? <Sparkles className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />} 
                {uploadedFile && !outputResult && !imageUrlResult ? 'Source File Status' : 'Live Output'}
              </span>
            </div>

            {/* LIVE DOCUMENT/IMAGE UPLOAD STATUS (PRE-EXECUTION) */}
            {!isRunning && !outputResult && !imageUrlResult && !videoUrlResult && uploadedFile && (
              <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-inner">
                {uploadedFile.type.startsWith('image/') && previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-[350px] object-contain rounded shadow-lg" />
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-lg">
                      <Paperclip className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg truncate max-w-sm mx-auto">{uploadedFile.name}</h3>
                      <p className="text-slate-400 text-xs mt-1 font-bold">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded & Ready for Processing
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                      Provide your parameters on the left and click "Execute Tool" to process this file.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* RESULTS AFTER EXECUTION */}
            {isRunning && <AIProcessingState tool={tool} currentStep="Processing Request..." progressPercent={progressPercent} elapsedSec={elapsedSec} />}

            {imageUrlResult && !isRunning && (
              <div className="space-y-3 w-full">
                <img src={imageUrlResult} alt="Generated Output" className="w-full h-auto max-h-[440px] object-contain rounded shadow-lg" />
              </div>
            )}
            
            {/* CLEAN TEXT/PDF OUTPUT WITHOUT CONSOLE LOG */}
            {outputResult && !imageUrlResult && !videoUrlResult && !isRunning && (
              <div className="space-y-4 w-full h-full flex flex-col">
                <div className="flex-1 bg-[#0A0A0A] border border-emerald-500/30 rounded-lg p-6 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-lg shadow-emerald-500/5">
                  {outputResult}
                </div>
                <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all">
                  <Download className="w-4 h-4" /> Download Processed File
                </button>
              </div>
            )}
          </div>
