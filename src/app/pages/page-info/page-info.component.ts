import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClincDTO } from 'src/app/dtos/clinc.dto';
import { ClincService } from 'src/app/services/clinc.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.scss']
})
export class PageInfoComponent implements OnInit {

  clinicId: number | null = null;
  buttonLabel: string = 'Cadastrar';

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    cep: new FormControl('', [Validators.required]),
    uf: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    city: new FormControl('', [Validators.required]),
    neighborhood: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    number: new FormControl('', []),
    complement: new FormControl('', [])
  });

  constructor(
    private activateRoute: ActivatedRoute,
    private clincService: ClincService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    const paramRaw = this.activateRoute.snapshot.paramMap.get('id');
    
   
    this.clinicId = paramRaw ? parseInt(paramRaw, 10) : null;
    this.buttonLabel = this.clinicId ? 'Salvar' : 'Cadastrar';
    if (this.clinicId) {
      this.clincService.getClinicById(this.clinicId.toString()).subscribe({
        next: (clinic) => {
          this.form.patchValue(clinic);
        },
        error: (err) => {
          console.error('Erro ao carregar clínica:', err);
        }
      });
    }
  }
  
  formSubmit(): void {
    const bodySubmit: ClincDTO = {
      id: this.clinicId ?? undefined,
      name: this.form.get('name')?.value,
      ownerName: this.form.get('ownerName')?.value,
      phone: this.form.get('phone')?.value,
      cep: this.form.get('cep')?.value,
      uf: this.form.get('uf')?.value,
      city: this.form.get('city')?.value,
      neighborhood: this.form.get('neighborhood')?.value,
      street: this.form.get('street')?.value,
      number: this.form.get('number')?.value,
      complement: this.form.get('complement')?.value,
    };

    if (this.clinicId) {

      this.clincService.editClinc(this.clinicId.toString(), bodySubmit).subscribe({
        next: () => {
          this.toastService.showSuccess('Clínica atualizada com sucesso!');
          this.router.navigate(['/session/list']);
        },
        error: (err: any) => {
          this.toastService.showError('Erro ao atualizar clínica.');
          console.error('Erro ao atualizar clínica:', err);
        }
      });
    } else {
      this.clincService.createClinic(bodySubmit).subscribe({
        next: () => {
          this.toastService.showSuccess('Clínica criada com sucesso!');
          this.router.navigate(['/session/list']);
        },
        error: (err: any) => {
          this.toastService.showError('Erro ao criar clínica.');
          console.error('Erro ao criar clínica:', err);
        }
      });
    }
  }
}
