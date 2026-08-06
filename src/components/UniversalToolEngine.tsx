// Inside src/components/UniversalToolEngine.tsx -> handleExecute

// BEFORE:
// const validation = UniversalValidationEngine.validate(tool, inputValues, uploadedFiles);

// AFTER (Change it to await):
const validation = await UniversalValidationEngine.validate(tool, inputValues, uploadedFiles);

// And inside the success block of apiService.execute:
// Add this line to actually deduct credits when the tool succeeds!
if (tool.validation?.requireWalletCredits && auth.currentUser) {
  UniversalWalletEngine.deductCredits(auth.currentUser.uid, tool.validation.requireWalletCredits);
}
