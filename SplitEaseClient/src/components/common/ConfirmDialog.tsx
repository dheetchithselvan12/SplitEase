import { ConfirmDialog as PrimeConfirmDialog } from 'primereact/confirmdialog';

const ConfirmDialog = () => (
  <PrimeConfirmDialog
    message="Are you sure you want to proceed?"
    header="Confirmation"
    icon="pi pi-exclamation-triangle"
    acceptClassName="p-button-danger"
  />
);

export default ConfirmDialog;